import type { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardGraphProps {
  moodTrends: Array<{ date: string; mood: string; count: number }>;
  focusStats: {
    totalSessions: number;
    totalMinutes: number;
    averageMood: string;
  };
}

const DashboardGraph: FC<DashboardGraphProps> = ({
  moodTrends,
  focusStats,
}) => {
  // Convert mood strings to numeric values for charting
  const moodToNumber = (mood: string) => {
    const moodMap: { [key: string]: number } = {
      happy: 5,
      neutral: 3,
      sad: 1,
      angry: 2,
      anxious: 2,
      tired: 2,
    };
    return moodMap[mood] || 3;
  };

  const chartData = moodTrends.map((item) => ({
    ...item,
    moodValue: moodToNumber(item.mood),
  }));

  return (
    <div className="space-y-6">
      {/* Mood Trends Chart */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-4">
          Weekly Mood Trends
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="moodValue"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Focus Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {focusStats.totalSessions}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Focus Sessions</div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
            {focusStats.totalMinutes}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Minutes Focused
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 capitalize">
            {focusStats.averageMood}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Avg. Post-Session Mood
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
