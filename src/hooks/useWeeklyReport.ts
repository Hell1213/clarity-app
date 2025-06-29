import { useState } from "react";
import {
  getRecentJournalEntries,
  getRecentFocusSessions,
} from "../utils/firestore";
import type { JournalEntry, FocusSession } from "../types";

interface WeeklyReport {
  summary: string;
  moodTrend: string;
  focusStats: {
    totalSessions: number;
    totalMinutes: number;
    averageSessionLength: number;
    completionRate: number;
  };
  topDistractions: string[];
  recommendations: string[];
  weekRange: string;
}

export function useWeeklyReport(userId: string = "user123") {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get data for the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [journalEntries, focusSessions] = await Promise.all([
        getRecentJournalEntries(userId, 100), // Get more entries to filter by date
        getRecentFocusSessions(userId, 100),
      ]);

      // Filter for past week
      const weekEntries = journalEntries.filter(
        (entry) => new Date(entry.timestamp) >= oneWeekAgo
      );
      const weekSessions = focusSessions.filter(
        (session) => new Date(session.timestamp) >= oneWeekAgo
      );

      // Calculate stats
      const totalSessions = weekSessions.length;
      const totalMinutes = weekSessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      const averageSessionLength =
        totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
      const completionRate =
        totalSessions > 0
          ? Math.round(
              (weekSessions.filter((s) => s.completed).length / totalSessions) *
                100
            )
          : 0;

      // Analyze mood trends
      const moodCounts: Record<string, number> = {};
      weekEntries.forEach((entry) => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });
      const dominantMood =
        Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "neutral";

      // Get top distractions
      const distractionCounts: Record<string, number> = {};
      weekSessions.forEach((session) => {
        const distraction = (session as any).distraction || "None";
        if (distraction !== "None") {
          distractionCounts[distraction] =
            (distractionCounts[distraction] || 0) + 1;
        }
      });
      const topDistractions = Object.entries(distractionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([distraction]) => distraction);

      // Generate summary and recommendations
      const summary = generateSummary(weekEntries, weekSessions, dominantMood);
      const moodTrend = generateMoodTrend(weekEntries, dominantMood);
      const recommendations = generateRecommendations(
        weekEntries,
        weekSessions,
        topDistractions
      );

      const weekRange = `${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}`;

      setReport({
        summary,
        moodTrend,
        focusStats: {
          totalSessions,
          totalMinutes,
          averageSessionLength,
          completionRate,
        },
        topDistractions,
        recommendations,
        weekRange,
      });
    } catch (err) {
      setError("Failed to generate weekly report");
      console.error("Error generating weekly report:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    generateReport,
  };
}

function generateSummary(
  entries: JournalEntry[],
  sessions: FocusSession[],
  dominantMood: string
): string {
  const entryCount = entries.length;
  const sessionCount = sessions.length;

  if (entryCount === 0 && sessionCount === 0) {
    return "This week was quiet. Consider starting your wellness journey with a journal entry or focus session!";
  }

  const moodEmoji =
    { happy: "😊", sad: "😢", neutral: "😐", anxious: "😰", excited: "🤩" }[
      dominantMood
    ] || "😐";

  return `This week, you completed ${sessionCount} focus sessions and wrote ${entryCount} journal entries. Your overall mood trended toward ${dominantMood} ${moodEmoji}. Keep up the great work!`;
}

function generateMoodTrend(
  entries: JournalEntry[],
  dominantMood: string
): string {
  if (entries.length === 0) return "No mood data available this week.";

  const moodDescriptions = {
    happy: "You've been feeling positive and upbeat this week!",
    sad: "You've had some challenging moments this week. Remember, it's okay to not be okay.",
    neutral: "You've maintained a balanced emotional state this week.",
    anxious:
      "You've experienced some anxiety this week. Consider practicing mindfulness.",
    excited: "You've been enthusiastic and motivated this week!",
  };
  return (
    moodDescriptions[dominantMood as keyof typeof moodDescriptions] ||
    "Your mood has been varied this week."
  );
}

function generateRecommendations(
  entries: JournalEntry[],
  sessions: FocusSession[],
  distractions: string[]
): string[] {
  const recommendations: string[] = [];

  if (sessions.length < 3) {
    recommendations.push(
      "Try to complete at least 3 focus sessions next week for better productivity."
    );
  }

  if (entries.length < 2) {
    recommendations.push(
      "Consider journaling more frequently to track your emotional well-being."
    );
  }

  if (distractions.length > 0) {
    const topDistraction = distractions[0];
    recommendations.push(
      `Your main distraction is ${topDistraction}. Try setting your phone to Do Not Disturb during focus sessions.`
    );
  }

  if (sessions.length > 0) {
    const avgDuration =
      sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
    if (avgDuration < 25) {
      recommendations.push(
        "Your sessions are quite short. Try extending them to 25-30 minutes for better focus."
      );
    }
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "You're doing great! Keep maintaining this balance of focus and reflection."
    );
  }

  return recommendations.slice(0, 3); // Limit to 3 recommendations
}
