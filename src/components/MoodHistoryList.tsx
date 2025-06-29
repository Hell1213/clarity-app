import type { FC } from "react";
import type { JournalEntry } from "../types";

const moodEmoji: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😔",
  angry: "😠",
  anxious: "😰",
  tired: "😴",
  excited: "🤩",
};

interface MoodHistoryListProps {
  entries: JournalEntry[];
}

const MoodHistoryList: FC<MoodHistoryListProps> = ({ entries }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-8 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-4">
        Mood History
      </h3>
      {entries.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center">
          No journal entries yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex gap-4 items-start border-b last:border-b-0 pb-3 border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mt-1">
                {moodEmoji[entry.mood?.toLowerCase() || "neutral"] || "📝"}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {typeof entry.date === "string"
                      ? entry.date
                      : new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 capitalize">
                    {entry.mood}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 mb-1">
                  {entry.content}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                  {entry.suggestion}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodHistoryList;
