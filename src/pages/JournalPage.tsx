import type { FC } from "react";
import { useState } from "react";
import AIJournalChat from "../components/AIJournalChat";
import JournalHistory from "../components/JournalHistory";

const JournalPage: FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntrySaved = () => {
    // Trigger refresh of journal history
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Journal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your personal AI companion for reflection and growth
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Chat Interface */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Chat with AI
            </h2>
            <AIJournalChat onEntrySaved={handleEntrySaved} />
          </div>

          {/* Journal History */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Journal History
            </h2>
            <JournalHistory refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Companion
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Chat with an AI that understands your emotions and provides
              personalized insights.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Voice Input
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Speak naturally and let AI transcribe your thoughts. Perfect for
              hands-free journaling.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mood Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time sentiment analysis with personalized suggestions for
              emotional wellness.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Rich History
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Search, filter, and explore your journal entries with powerful
              organization tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
