export interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  suggestion: string;
  timestamp: Date;
  userId: string;
  date?: string; // YYYY-MM-DD for streaks
}

export interface MoodAnalysis {
  mood: string;
  suggestion: string;
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  mood: string;
  timestamp: Date;
  userId: string;
  completed: boolean;
  comment?: string;
  label?: string;
  note?: string;
  breakDuration?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface DashboardData {
  weeklyMoodTrends: Array<{
    date: string;
    mood: string;
    count: number;
  }>;
  focusStats: {
    totalSessions: number;
    totalMinutes: number;
    averageMood: string;
  };
  recentEntries: JournalEntry[];
}
