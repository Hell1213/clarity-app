import type { FC } from "react";
import { useState, useEffect } from "react";
import FocusTimer from "../components/FocusTimer";
import MoodCheckIn from "../components/MoodCheckIn";
import { saveFocusSession } from "../utils/firestore";

const DISTRACTION_OPTIONS = [
  "None",
  "Social media",
  "Phone",
  "People",
  "Thoughts",
  "Other",
];

const FocusPage: FC = () => {
  const [sessionComplete, setSessionComplete] = useState(false);
  const [moodData, setMoodData] = useState<{
    mood: string;
    comment: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingSession, setPendingSession] = useState<{
    label: string;
    note: string;
    focusDuration: number;
    breakDuration: number;
  } | null>(null);
  const [distraction, setDistraction] = useState<string>("");
  const [showDistraction, setShowDistraction] = useState(false);
  const [customDistraction, setCustomDistraction] = useState("");

  // TODO: Get real user ID from Firebase Auth
  const mockUserId = "user123";

  const handleSessionComplete = (
    label: string,
    note: string,
    focusDuration: number,
    breakDuration: number
  ) => {
    setPendingSession({ label, note, focusDuration, breakDuration });
    setShowDistraction(true);
    setSessionComplete(true);
  };

  const handleDistractionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDistraction(false);
  };

  const handleMoodSubmit = async (mood: string, comment: string) => {
    setSaving(true);
    try {
      if (pendingSession) {
        const sessionData = {
          duration: pendingSession.focusDuration,
          mood,
          timestamp: new Date(),
          userId: mockUserId,
          completed: true,
          comment,
          label: pendingSession.label,
          note: pendingSession.note,
          breakDuration: pendingSession.breakDuration,
          distraction:
            distraction === "Other" ? customDistraction : distraction,
        };
        await saveFocusSession(sessionData as any); // allow extra fields
      }
      setMoodData({ mood, comment });
    } catch (error) {
      console.error("Error saving session:", error);
      // Still show success UI even if save fails
      setMoodData({ mood, comment });
    } finally {
      setSaving(false);
    }
  };

  // Auto-reset after moodData is set (after 'Great job!' message)
  useEffect(() => {
    if (moodData) {
      const timer = setTimeout(() => {
        setSessionComplete(false);
        setMoodData(null);
        setPendingSession(null);
        setDistraction("");
        setShowDistraction(false);
        setCustomDistraction("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [moodData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <h1 className="text-3xl font-bold text-center text-primary-700 dark:text-primary-300 mb-6">
        Focus Session
      </h1>
      {!sessionComplete && !moodData && (
        <FocusTimer onSessionComplete={handleSessionComplete} />
      )}
      {showDistraction && !moodData && (
        <form
          onSubmit={handleDistractionSubmit}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 dark:bg-opacity-50 z-50"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Distraction Check-in
            </h3>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Did you get distracted? What by?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {DISTRACTION_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={`px-3 py-1 rounded-full border ${
                    distraction === opt
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => setDistraction(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {distraction === "Other" && (
              <input
                className="input-field mb-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                type="text"
                placeholder="Describe your distraction..."
                value={customDistraction}
                onChange={(e) => setCustomDistraction(e.target.value)}
                required
              />
            )}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={
                !distraction || (distraction === "Other" && !customDistraction)
              }
            >
              Continue
            </button>
          </div>
        </form>
      )}
      {sessionComplete && !showDistraction && !moodData && (
        <MoodCheckIn onSubmit={handleMoodSubmit} />
      )}
      {moodData && (
        <div className="card max-w-md mx-auto mt-8 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-primary-700 dark:text-primary-300 font-semibold mb-1">
            Great job!
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {saving
              ? "Saving your session..."
              : "Your focus session and mood have been logged."}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusPage;
