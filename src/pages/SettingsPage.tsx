import { useSettings } from "../hooks/useSettings";
import type { ColorTheme } from "../hooks/useSettings";

const colorThemes: { value: ColorTheme; label: string; color: string }[] = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
];

export default function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-6 text-center">
          Pomodoro Settings
        </h1>
        {/* Pomodoro Duration */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            🕐 Pomodoro Duration
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setPomodoroDuration(
                  Math.max(5, settings.pomodoroDuration - 5)
                )
              }
            >
              –
            </button>
            <span className="text-lg font-semibold w-12 text-center text-gray-800 dark:text-gray-100">
              {settings.pomodoroDuration} min
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setPomodoroDuration(
                  Math.min(180, settings.pomodoroDuration + 5)
                )
              }
            >
              +
            </button>
          </div>
        </div>
        {/* Short Break */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            🌿 Short Break
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setShortBreak(Math.max(1, settings.shortBreak - 1))
              }
            >
              –
            </button>
            <span className="text-lg font-semibold w-12 text-center text-gray-800 dark:text-gray-100">
              {settings.shortBreak} min
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setShortBreak(Math.min(30, settings.shortBreak + 1))
              }
            >
              +
            </button>
          </div>
        </div>
        {/* Long Break */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            🌴 Long Break
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setLongBreak(Math.max(5, settings.longBreak - 1))
              }
            >
              –
            </button>
            <span className="text-lg font-semibold w-12 text-center text-gray-800 dark:text-gray-100">
              {settings.longBreak} min
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setLongBreak(Math.min(60, settings.longBreak + 1))
              }
            >
              +
            </button>
          </div>
        </div>
        {/* Color Theme */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            🎨 Color Theme
          </label>
          <div className="grid grid-cols-5 gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme.value}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  theme.color
                } ${
                  settings.colorTheme === theme.value
                    ? "border-black dark:border-white"
                    : "border-transparent"
                }`}
                onClick={() => settings.setColorTheme(theme.value)}
                aria-label={theme.label}
              >
                {settings.colorTheme === theme.value && (
                  <span className="text-white text-xl">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Notifications */}
        <div className="mb-4 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            🔔 Notifications
          </label>
          <button
            className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
              settings.notifications
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => settings.setNotifications(!settings.notifications)}
            aria-label="Toggle notifications"
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow transform transition ${
                settings.notifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {/* Sound */}
        <div className="mb-4 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            🔊 Sound Effects
          </label>
          <button
            className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
              settings.soundEnabled
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
            aria-label="Toggle sound effects"
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow transform transition ${
                settings.soundEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {/* Pomodoros Until Long Break */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            🎯 Pomodoros Until Long Break
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setPomodorosUntilLongBreak(
                  Math.max(1, settings.pomodorosUntilLongBreak - 1)
                )
              }
            >
              –
            </button>
            <span className="text-lg font-semibold w-12 text-center text-gray-800 dark:text-gray-100">
              {settings.pomodorosUntilLongBreak}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setPomodorosUntilLongBreak(
                  Math.min(10, settings.pomodorosUntilLongBreak + 1)
                )
              }
            >
              +
            </button>
          </div>
        </div>
        {/* Daily Goal */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            🏆 Daily Goal
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setDailyGoal(Math.max(1, settings.dailyGoal - 1))
              }
            >
              –
            </button>
            <span className="text-lg font-semibold w-12 text-center text-gray-800 dark:text-gray-100">
              {settings.dailyGoal}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                settings.setDailyGoal(Math.min(24, settings.dailyGoal + 1))
              }
            >
              +
            </button>
          </div>
        </div>
        {/* Save/Confirm Button */}
        <div className="flex justify-center">
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center text-2xl"
            aria-label="Save settings"
            title="Save settings"
            disabled
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}
