import { useSettings } from "../hooks/useSettings";

interface DailyGoalProgressProps {
  completedSessions: number;
}

export default function DailyGoalProgress({
  completedSessions,
}: DailyGoalProgressProps) {
  const { dailyGoal } = useSettings();

  // Calculate progress percentage
  const progress = Math.min((completedSessions / dailyGoal) * 100, 100);
  const isGoalReached = completedSessions >= dailyGoal;

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (isGoalReached) {
      return "🎉 Amazing! You've reached your daily goal!";
    } else if (progress >= 75) {
      return "🔥 So close! You're almost there!";
    } else if (progress >= 50) {
      return "💪 Halfway there! Keep going!";
    } else if (progress >= 25) {
      return "🚀 Great start! You're building momentum!";
    } else {
      return "🌟 Ready to start your productive day?";
    }
  };

  // Get progress color based on completion
  const getProgressColor = () => {
    if (isGoalReached) return "bg-green-500";
    if (progress >= 75) return "bg-yellow-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          🎯 Daily Goal
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {completedSessions}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            of {dailyGoal} sessions
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()} dark:${getProgressColor()
              .replace("bg-", "bg-")
              .replace("-500", "-400")}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="text-center mb-4">
        <p className="text-gray-700 dark:text-gray-200 font-medium">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {completedSessions}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Completed
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-600 dark:text-gray-200">
            {dailyGoal - completedSessions}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Remaining
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            0
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Day Streak
          </div>
        </div>
      </div>

      {/* Goal Status */}
      {isGoalReached && (
        <div className="mt-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-600 dark:text-green-300 text-xl mr-2">
              ✅
            </span>
            <span className="text-green-800 dark:text-green-200 font-medium">
              Daily goal achieved!
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition text-sm font-medium">
          Start Session
        </button>
        <button className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm font-medium">
          View History
        </button>
      </div>
    </div>
  );
}
