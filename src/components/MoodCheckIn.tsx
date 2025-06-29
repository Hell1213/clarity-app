import type { FC } from "react";
import { useState } from "react";
import { useHaptics } from "../hooks/useHaptics";

const MOODS = [
  { label: "😊", value: "happy" },
  { label: "😐", value: "neutral" },
  { label: "😔", value: "sad" },
  { label: "😠", value: "angry" },
  { label: "😰", value: "anxious" },
  { label: "😴", value: "tired" },
];

interface MoodCheckInProps {
  onSubmit: (mood: string, comment: string) => void;
}

const MoodCheckIn: FC<MoodCheckInProps> = ({ onSubmit }) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [comment, setComment] = useState("");
  const { light, success } = useHaptics();

  const handleMoodSelect = (mood: string) => {
    light(); // Haptic feedback for mood selection
    setSelectedMood(mood);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;
    success(); // Haptic feedback for submitting mood
    onSubmit(selectedMood, comment);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card max-w-md mx-auto flex flex-col items-center mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
        How do you feel after this session?
      </h3>
      <div className="flex gap-3 mb-4">
        {MOODS.map((mood) => (
          <button
            type="button"
            key={mood.value}
            className={`text-3xl p-2 rounded-full border-2 transition-colors duration-150 ${
              selectedMood === mood.value
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
                : "border-transparent"
            }`}
            onClick={() => handleMoodSelect(mood.value)}
            aria-label={mood.value}
          >
            {mood.label}
          </button>
        ))}
      </div>
      <textarea
        className="input-field mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Optional comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!selectedMood}
      >
        Submit
      </button>
    </form>
  );
};

export default MoodCheckIn;
