import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../hooks/useTimer";
import { useSettings } from "../hooks/useSettings";
import { useSound } from "../hooks/useSound";
import { useHaptics } from "../hooks/useHaptics";
import Confetti from "./Confetti";

const CIRCLE_RADIUS = 100;
const CIRCLE_STROKE = 18;
const CIRCLE_CIRCUM = 2 * Math.PI * CIRCLE_RADIUS;

const themeColors: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  purple: "#a21caf",
  orange: "#f59e42",
};
const themeBg: Record<string, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  purple: "bg-purple-50",
  orange: "bg-orange-50",
};

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface FocusTimerProps {
  onSessionComplete?: (
    sessionLabel: string,
    note: string,
    focusDuration: number,
    breakDuration: number
  ) => void;
}

const FocusTimer: FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const settings = useSettings();
  const { playSound } = useSound();
  const { medium, success, light } = useHaptics();
  const navigate = useNavigate();
  const [sessionLabel, setSessionLabel] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [sessionNote, setSessionNote] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(
    settings.pomodoroDuration
  );

  // Update duration when settings change
  useEffect(() => {
    if (timerMode === "focus") {
      setCurrentDuration(settings.pomodoroDuration);
    } else if (timerMode === "shortBreak") {
      setCurrentDuration(settings.shortBreak);
    } else if (timerMode === "longBreak") {
      setCurrentDuration(settings.longBreak);
    }
  }, [settings, timerMode]);

  // useTimer hook with current duration
  const { secondsLeft, isRunning, start, pause, reset } = useTimer({
    duration: currentDuration,
    onComplete: () => {
      if (settings.soundEnabled) {
        playSound("timer-complete");
      }
      success();
      setShowConfetti(true);

      if (timerMode === "focus") {
        // Focus session completed, start break
        setCompletedSessions((prev) => prev + 1);
        const shouldTakeLongBreak =
          (completedSessions + 1) % settings.pomodorosUntilLongBreak === 0;
        const nextMode: TimerMode = shouldTakeLongBreak
          ? "longBreak"
          : "shortBreak";
        setTimerMode(nextMode);
        setShowNote(true);

        // Play break start sound after a short delay
        setTimeout(() => {
          if (settings.soundEnabled) {
            playSound("break-start");
          }
        }, 500);
      } else {
        // Break completed, start next focus session
        setTimerMode("focus");
        setShowNote(false);
        setSessionNote("");
        setSessionLabel("");

        // Play focus start sound after a short delay
        setTimeout(() => {
          if (settings.soundEnabled) {
            playSound("focus-start");
          }
        }, 500);
      }
    },
  });

  const handleStart = () => {
    if (settings.soundEnabled) {
      if (timerMode === "focus") {
        playSound("focus-start");
      } else {
        playSound("break-start");
      }
    }
    medium();
    start();
  };

  const handlePause = () => {
    if (settings.soundEnabled) {
      playSound("pause");
    }
    light();
    pause();
  };

  const handleReset = () => {
    if (settings.soundEnabled) {
      playSound("reset");
    }
    light();
    reset();
    setShowNote(false);
    setSessionNote("");
    setTimerMode("focus");
  };

  const handleEditSettings = () => {
    light(); // Haptic feedback
    navigate("/settings");
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success();
    setShowNote(false);
    if (onSessionComplete) {
      onSessionComplete(
        sessionLabel,
        sessionNote,
        settings.pomodoroDuration,
        timerMode === "longBreak" ? settings.longBreak : settings.shortBreak
      );
    }
    setSessionNote("");
    setSessionLabel("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Progress: arc UNFILLS as time goes (shrinks clockwise)
  const progress = secondsLeft / (currentDuration * 60);
  const dashOffset = CIRCLE_CIRCUM * (1 - progress);
  const ringColor = themeColors[settings.colorTheme] || themeColors.blue;
  const bgClass = themeBg[settings.colorTheme] || themeBg.blue;

  const getModeInfo = () => {
    switch (timerMode) {
      case "focus":
        return {
          title: "Focus Time",
          subtitle: "Ready to Focus",
          emoji: "🎯",
          color: ringColor,
        };
      case "shortBreak":
        return {
          title: "Short Break",
          subtitle: "Take a quick rest",
          emoji: "☕",
          color: "#22c55e",
        };
      case "longBreak":
        return {
          title: "Long Break",
          subtitle: "Well deserved rest!",
          emoji: "🌴",
          color: "#f59e42",
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-2 sm:px-4">
      {/* Confetti Animation */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Session Counter */}
      {timerMode === "focus" && (
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Session {completedSessions + 1} of{" "}
            {settings.pomodorosUntilLongBreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {completedSessions} completed
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center justify-center mb-4">
        {/* SVG Circular Progress */}
        <div
          className={`rounded-full shadow-2xl ${bgClass} dark:bg-gray-800 flex items-center justify-center`}
          style={{ width: 240, height: 240 }}
        >
          <svg
            width={220}
            height={220}
            className="block"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background ring */}
            <circle
              cx={110}
              cy={110}
              r={CIRCLE_RADIUS}
              stroke="#e5e7eb"
              strokeWidth={CIRCLE_STROKE}
              fill="none"
              className="dark:stroke-gray-700"
            />
            {/* Foreground progress ring (unfills as time passes) */}
            <circle
              cx={110}
              cy={110}
              r={CIRCLE_RADIUS}
              stroke={modeInfo.color}
              strokeWidth={CIRCLE_STROKE}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUM}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.5s linear",
                filter: `drop-shadow(0 0 8px ${modeInfo.color}88)`,
              }}
            />
          </svg>
          {/* Play/Pause Button in Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <button
              className={`bg-white dark:bg-gray-900 shadow-lg border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-full w-20 h-20 flex items-center justify-center text-4xl focus:outline-none hover:bg-primary-50 dark:hover:bg-primary-900 transition duration-150 ${
                isRunning ? "ring-2 ring-primary-300 dark:ring-primary-600" : ""
              }`}
              onClick={isRunning ? handlePause : handleStart}
              aria-label={isRunning ? "Pause" : "Start"}
              disabled={secondsLeft === 0}
            >
              {isRunning ? (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect
                    x="8"
                    y="8"
                    width="6"
                    height="20"
                    rx="2"
                    fill={modeInfo.color}
                  />
                  <rect
                    x="22"
                    y="8"
                    width="6"
                    height="20"
                    rx="2"
                    fill={modeInfo.color}
                  />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <polygon points="10,8 28,18 10,28" fill={modeInfo.color} />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {formatTime(secondsLeft)}
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-300 mb-1">
          {modeInfo.title}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {modeInfo.subtitle}
        </div>
      </div>

      {/* Session Label Input - Only show during focus mode */}
      {timerMode === "focus" && (
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            placeholder="What are you working on?"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={isRunning ? handlePause : handleStart}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>

      {/* Edit Settings Button */}
      <div className="mb-6">
        <button
          onClick={handleEditSettings}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Edit Timer Settings
        </button>
      </div>

      {/* Session Note Modal - Only show after focus sessions */}
      {showNote && timerMode !== "focus" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Focus Session Complete! 🎉
            </h3>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How did this session go?
                </label>
                <textarea
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                  placeholder="Optional: Add notes about your focus session..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 min-h-[100px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition"
              >
                Complete Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
