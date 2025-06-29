import type { FC } from "react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="text-6xl mb-6">🌟</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Clarity
        </h1>

        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        {/* Loading Message */}
        <p className="text-gray-600 dark:text-gray-300 text-lg">{message}</p>

        {/* Subtle animation */}
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
