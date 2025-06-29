import { useWeeklyReport } from "../hooks/useWeeklyReport";

export default function WeeklyReportCard() {
  const { report, loading, error, generateReport } = useWeeklyReport();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">
          📊 Weekly Wellness Report
        </h2>
        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
          <p className="text-blue-600 dark:text-blue-400">
            Analyzing your week...
          </p>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          {/* Week Range */}
          <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">
            {report.weekRange}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              📝 Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Mood Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              😊 Mood Trend
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {report.moodTrend}
            </p>
          </div>

          {/* Focus Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
              🎯 Focus Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {report.focusStats.totalSessions}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Sessions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {report.focusStats.totalMinutes}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Minutes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {report.focusStats.averageSessionLength}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Length
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {report.focusStats.completionRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Completion
                </div>
              </div>
            </div>
          </div>

          {/* Top Distractions */}
          {report.topDistractions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                🚫 Top Distractions
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.topDistractions.map((distraction) => (
                  <span
                    key={distraction}
                    className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {distraction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              💡 Recommendations
            </h3>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed flex items-start"
                >
                  <span className="text-blue-500 dark:text-blue-400 mr-2">
                    •
                  </span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get insights into your wellness journey
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate a personalized report based on your journal entries and
            focus sessions
          </p>
        </div>
      )}
    </div>
  );
}
