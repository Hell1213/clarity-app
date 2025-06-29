import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type ColorTheme = "blue" | "green" | "red" | "purple" | "orange";

interface Settings {
  pomodoroDuration: number;
  shortBreak: number;
  longBreak: number;
  colorTheme: ColorTheme;
  notifications: boolean;
  soundEnabled: boolean;
  pomodorosUntilLongBreak: number;
  dailyGoal: number;
}

interface SettingsContextType extends Settings {
  setPomodoroDuration: (n: number) => void;
  setShortBreak: (n: number) => void;
  setLongBreak: (n: number) => void;
  setColorTheme: (t: ColorTheme) => void;
  setNotifications: (b: boolean) => void;
  setSoundEnabled: (b: boolean) => void;
  setPomodorosUntilLongBreak: (n: number) => void;
  setDailyGoal: (n: number) => void;
}

const defaultSettings: Settings = {
  pomodoroDuration: 90,
  shortBreak: 5,
  longBreak: 15,
  colorTheme: "blue",
  notifications: true,
  soundEnabled: true,
  pomodorosUntilLongBreak: 4,
  dailyGoal: 8,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("clarity_settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("clarity_settings", JSON.stringify(settings));
  }, [settings]);

  const value: SettingsContextType = {
    ...settings,
    setPomodoroDuration: (pomodoroDuration) =>
      setSettings((s) => ({ ...s, pomodoroDuration })),
    setShortBreak: (shortBreak) => setSettings((s) => ({ ...s, shortBreak })),
    setLongBreak: (longBreak) => setSettings((s) => ({ ...s, longBreak })),
    setColorTheme: (colorTheme) => setSettings((s) => ({ ...s, colorTheme })),
    setNotifications: (notifications) =>
      setSettings((s) => ({ ...s, notifications })),
    setSoundEnabled: (soundEnabled) =>
      setSettings((s) => ({ ...s, soundEnabled })),
    setPomodorosUntilLongBreak: (pomodorosUntilLongBreak) =>
      setSettings((s) => ({ ...s, pomodorosUntilLongBreak })),
    setDailyGoal: (dailyGoal) => setSettings((s) => ({ ...s, dailyGoal })),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
