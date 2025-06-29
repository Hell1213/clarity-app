import type { FC } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import DashboardGraph from "../components/DashboardGraph";
import MoodCalendar from "../components/MoodCalendar";
import MoodHistoryList from "../components/MoodHistoryList";
import WeeklyReportCard from "../components/WeeklyReportCard";
import DailyGoalProgress from "../components/DailyGoalProgress";
import AchievementBadges from "../components/AchievementBadges";
import DistractionAnalytics from "../components/DistractionAnalytics";
import { useHaptics } from "../hooks/useHaptics";
import { useAuth } from "../hooks/useAuth";
import {
  getRecentFocusSessions,
  getRecentJournalEntries,
} from "../utils/firestore";
import type { FocusSession, JournalEntry } from "../types";
import { calculateJournalStreak } from "../utils/sentimentLabels";

// Mock badges and motivational messages
const mockBadges = [
  { icon: "🔥", label: "7-Day Streak" },
  { icon: "🏅", label: "10 Focus Sessions" },
  { icon: "😊", label: "Consistent Mood" },
];

const getMotivationalMessage = (streak: number, mood: string) => {
  if (streak >= 7) return "Amazing! You're on a 7-day streak! Keep it up!";
  if (mood === "happy") return "Great mood! Keep spreading positivity.";
  if (mood === "sad")
    return "It's okay to have down days. Tomorrow is a new start!";
  return "Keep going! Every step counts.";
};

const DashboardPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { success } = useHaptics();
  const { user } = useAuth();

  // Use real user ID or fallback to mock for demo
  const userId = user?.uid || "demo-user";

  // Memoized calculations to prevent unnecessary re-renders
  const dashboardStats = useMemo(() => {
    const totalSessions = focusSessions.length;
    const totalMinutes = focusSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const averageMood =
      focusSessions.length > 0 ? focusSessions[0].mood : "neutral";

    const journalStreak = calculateJournalStreak(journalEntries);

    // Calculate today's completed sessions
    const today = new Date().toDateString();
    const todaysSessions = focusSessions.filter(
      (session) => new Date(session.timestamp).toDateString() === today
    );
    const completedSessionsToday = todaysSessions.length;

    // Calculate streaks and stats for achievements
    const currentStreak = journalStreak;
    const longestStreak = Math.max(currentStreak, 7);
    const totalFocusTime = totalMinutes;

    // Calculate most common distraction
    const distractionCounts: Record<string, number> = {};
    focusSessions.forEach((session) => {
      const d = (session as any).distraction || "None";
      distractionCounts[d] = (distractionCounts[d] || 0) + 1;
    });
    const mostCommonDistraction =
      Object.entries(distractionCounts)
        .filter(([d]) => d && d !== "None")
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return {
      totalSessions,
      totalMinutes,
      averageMood,
      journalStreak,
      completedSessionsToday,
      currentStreak,
      longestStreak,
      totalFocusTime,
      mostCommonDistraction,
    };
  }, [focusSessions, journalEntries]);

  // Memoized mood trends
  const moodTrends = useMemo(
    () => [
      { date: "Mon", mood: "happy", count: 2 },
      { date: "Tue", mood: "neutral", count: 1 },
      { date: "Wed", mood: "happy", count: 3 },
      { date: "Thu", mood: "sad", count: 1 },
      { date: "Fri", mood: "happy", count: 2 },
    ],
    []
  );

  const focusStats = useMemo(
    () => ({
      totalSessions: dashboardStats.totalSessions,
      totalMinutes: dashboardStats.totalMinutes,
      averageMood: dashboardStats.averageMood,
    }),
    [dashboardStats]
  );

  // Memoized motivational message
  const motivationalMessage = useMemo(
    () =>
      getMotivationalMessage(
        dashboardStats.journalStreak,
        dashboardStats.averageMood
      ),
    [dashboardStats.journalStreak, dashboardStats.averageMood]
  );

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessions, entries] = await Promise.all([
        getRecentFocusSessions(userId, 10),
        getRecentJournalEntries(userId, 50),
      ]);

      setFocusSessions(sessions);
      setJournalEntries(entries);

      // Haptic feedback for successful data load
      success();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      // Use mock data if Firestore fails
      setFocusSessions([]);
      setJournalEntries([]);
    } finally {
      setLoading(false);
    }
  }, [success, userId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">
            Dashboard
          </h1>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading your insights...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">
            Dashboard
          </h1>
          <div className="text-center text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 xl:px-16 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">
          Your Wellness Dashboard
        </h1>

        {/* Gamification: Badges & Motivational Message */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-4 mb-2">
            {mockBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg px-4 py-2 shadow-sm"
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 mt-1">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
          <div className="text-primary-600 dark:text-primary-400 text-md font-medium mt-2 text-center">
            {motivationalMessage}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="space-y-6">
          {/* Weekly Wellness Report */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <WeeklyReportCard />
          </div>
          {/* Mood Trends/Graph */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <DashboardGraph moodTrends={moodTrends} focusStats={focusStats} />
          </div>
          {/* Achievements Card (full content, not scrollable) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-300">
              Achievements
            </h2>
            <AchievementBadges
              totalSessions={dashboardStats.totalSessions}
              currentStreak={dashboardStats.currentStreak}
              longestStreak={dashboardStats.longestStreak}
              totalFocusTime={dashboardStats.totalFocusTime}
            />
          </div>
          {/* Distraction Analytics Card (full content, not scrollable) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-300">
              Distraction Analytics
            </h2>
            <DistractionAnalytics
              focusSessions={focusSessions}
              distractions={[]}
            />
          </div>
          {/* Journal Streak and Top Distraction side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Journal Streak Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Journal Streak
                </h3>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {dashboardStats.journalStreak}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {dashboardStats.journalStreak === 1 ? "day" : "days"} of
                  consistent journaling
                </p>
              </div>
            </div>
            {/* Top Distraction Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Top Distraction
                </h3>
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {dashboardStats.mostCommonDistraction}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Most common during focus sessions
                </p>
              </div>
            </div>
          </div>
          {/* Daily Goal Progress */}
          <DailyGoalProgress
            completedSessions={dashboardStats.completedSessionsToday}
          />

          {/* Mood Calendar/Heatmap */}
          <MoodCalendar entries={journalEntries} />
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
          {/* Mood History List */}
          <MoodHistoryList entries={journalEntries} />

          {/* Recent Focus Sessions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-4">
              Recent Focus Sessions
            </h2>
            <div className="space-y-4">
              {focusSessions.length > 0 ? (
                focusSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {session.mood === "happy" && "😊"}
                        {session.mood === "sad" && "😢"}
                        {session.mood === "neutral" && "😐"}
                        {session.mood === "excited" && "🤩"}
                        {session.mood === "stressed" && "😰"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                          {session.label || "Focus Session"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600 dark:text-primary-400">
                        {session.duration} min
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {session.mood}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>No focus sessions yet</p>
                  <p className="text-sm">
                    Start your first session to see your progress here!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
