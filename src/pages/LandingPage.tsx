import type { FC } from "react";
import { useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LandingAuthModal from "../components/LandingAuthModal";

const LandingPage: FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [isNavigating, setIsNavigating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // User is already logged in, go to dashboard with smooth transition
      setIsNavigating(true);
      startTransition(() => {
        navigate("/dashboard");
      });
    } else {
      // Show signup modal for new users
      setAuthMode("signup");
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌟</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Clarity
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {!user && (
              <button
                onClick={handleSignIn}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={handleGetStarted}
              disabled={isNavigating}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isNavigating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : user ? (
                "Go to Dashboard"
              ) : (
                "Get Started Free"
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              {" "}
              Focus
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your productivity and mental wellness with AI-powered
            focus tracking, mood analysis, and personalized insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {user ? "Continue Your Journey" : "Start Free Today"}
            </button>
            {!user && (
              <button
                onClick={handleSignIn}
                className="border-2 border-primary-600 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need for mental wellness
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful tools designed to help you focus, reflect, and grow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Focus Timer
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Pomodoro technique with customizable sessions and break reminders
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Mood Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered sentiment analysis to understand your emotional
              patterns
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed insights into your productivity and wellness trends
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Journal
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Private space for reflection with AI-powered writing assistance
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Built with modern technology
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fast, secure, and always up-to-date
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-2">⚛️</div>
            <p className="font-semibold text-gray-900 dark:text-white">React</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔷</div>
            <p className="font-semibold text-gray-900 dark:text-white">
              TypeScript
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Firebase
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Tailwind
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to transform your productivity?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who have already improved their focus and
            mental wellness
          </p>
          <button
            onClick={handleGetStarted}
            disabled={isNavigating}
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : user ? (
              "Go to Dashboard"
            ) : (
              "Get Started Free"
            )}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">🌟</div>
            <span className="text-xl font-bold">Clarity</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering mental wellness through technology
          </p>
          <div className="text-sm text-gray-500">
            © 2024 Clarity. Built with ❤️ for better focus and mental health.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <LandingAuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
