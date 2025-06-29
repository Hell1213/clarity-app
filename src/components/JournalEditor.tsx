import type { FC } from "react";
import { useState } from "react";
import { analyzeEmotion } from "../api/analyzeEmotion";
import { saveJournalEntry } from "../utils/firestore";

interface EmotionFeedbackProps {
  mood: string;
  suggestion: string;
}

const EmotionFeedback: FC<EmotionFeedbackProps> = ({ mood, suggestion }) => (
  <div className="mt-4 p-4 rounded-lg bg-primary-50 dark:bg-primary-900 border border-primary-100 dark:border-primary-700">
    <div className="font-semibold text-primary-700 dark:text-primary-300">
      Mood: <span className="capitalize">{mood}</span>
    </div>
    <div className="text-gray-700 dark:text-gray-200 mt-1">
      Suggestion: {suggestion}
    </div>
  </div>
);

const JournalEditor: FC = () => {
  const [journalText, setJournalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    mood: string;
    suggestion: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // TODO: Get real user ID from Firebase Auth
  const mockUserId = "user123";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await analyzeEmotion(journalText);
      setFeedback(result);

      // Save to Firestore
      setSaving(true);
      const entryData = {
        content: journalText,
        mood: result.mood,
        suggestion: result.suggestion,
        timestamp: new Date(),
        userId: mockUserId,
      };

      await saveJournalEntry(entryData);
      setSaving(false);
    } catch (err) {
      setError("Failed to analyze your journal. Please try again.");
      setSaving(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-primary-700 dark:text-primary-300">
        Journal Entry
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input-field min-h-[120px] resize-vertical mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="How are you feeling today? Write your thoughts..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Emotion"}
        </button>
      </form>
      {error && (
        <div className="text-red-500 dark:text-red-400 mt-2">{error}</div>
      )}
      {feedback && (
        <>
          <EmotionFeedback
            mood={feedback.mood}
            suggestion={feedback.suggestion}
          />
          {saving && (
            <div className="text-gray-600 dark:text-gray-300 mt-2 text-center">
              Saving your entry...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JournalEditor;
