import type { FC } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJournalEntries } from "../utils/firestore";

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  suggestion: string;
  aiResponse?: string;
  timestamp: Date;
  userId: string;
}

interface JournalHistoryProps {
  onEntrySelect?: (entry: JournalEntry) => void;
  refreshTrigger?: number;
}

const JournalHistory: FC<JournalHistoryProps> = ({
  onEntrySelect,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const moods = [
    "all",
    "happy",
    "sad",
    "angry",
    "anxious",
    "excited",
    "calm",
    "stressed",
    "grateful",
    "neutral",
  ];

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user, refreshTrigger]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const userEntries = await getJournalEntries(user!.uid);
      setEntries(
        userEntries.sort(
          (a: JournalEntry, b: JournalEntry) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    } catch (error) {
      console.error("Error loading journal entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood =
      moodFilter === "all" || entry.mood.toLowerCase() === moodFilter;
    return matchesSearch && matchesMood;
  });

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      anxious: "😰",
      excited: "🤩",
      calm: "😌",
      stressed: "😰",
      grateful: "🙏",
      neutral: "😐",
    };
    return moodEmojis[mood.toLowerCase()] || "🤔";
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - entryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return entryDate.toLocaleDateString();
  };

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    onEntrySelect?.(entry);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Journal History ({filteredEntries.length})
        </h3>

        {/* Search and Filters */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />

          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setMoodFilter(mood)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  moodFilter === mood
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {mood === "all"
                  ? "All"
                  : `${getMoodEmoji(mood)} ${
                      mood.charAt(0).toUpperCase() + mood.slice(1)
                    }`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {entries.length === 0 ? (
              <div>
                <div className="text-4xl mb-2">📝</div>
                <p>No journal entries yet</p>
                <p className="text-sm">
                  Start your first conversation with your AI companion!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">🔍</div>
                <p>No entries match your search</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedEntry?.id === entry.id
                    ? "bg-primary-50 dark:bg-primary-900/20"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {entry.mood}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                  {entry.content}
                </p>

                {entry.suggestion && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-2">
                    💡 {entry.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Entry Details */}
      {selectedEntry && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Entry Details
            </h4>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Your thoughts:
              </p>
              <p className="text-gray-900 dark:text-white">
                {selectedEntry.content}
              </p>
            </div>

            {selectedEntry.aiResponse && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  AI Response:
                </p>
                <p className="text-gray-900 dark:text-white italic">
                  {selectedEntry.aiResponse}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span>{getMoodEmoji(selectedEntry.mood)}</span>
                <span className="capitalize">{selectedEntry.mood}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(selectedEntry.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHistory;
