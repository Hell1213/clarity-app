import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./AuthModal";

const UserMenu = () => {
  const { user, logout, signInWithGoogle, loading, clearError } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    clearError();
    try {
      await signInWithGoogle();
      setOpen(false);
    } catch (e: any) {
      setGoogleError(e.message || "Google login failed");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow hover:scale-105 transition-transform"
        aria-label="User menu"
      >
        {user ? (
          <span className="text-lg font-bold text-white uppercase">
            {user.email?.[0] || "U"}
          </span>
        ) : (
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 animate-fade-in">
          {!user ? (
            <>
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium rounded-t-xl"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthModal(true);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={handleGoogleLogin}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium rounded-b-xl flex items-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <g>
                    <path
                      fill="#4285F4"
                      d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.4-.1-2.7-.3-4z"
                    />
                    <path
                      fill="#34A853"
                      d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M24 45c5.8 0 10.7-1.9 14.3-5.1l-6.6-5.4C29.7 36.1 27 37 24 37c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.1 41.2 14.9 45 24 45z"
                    />
                    <path
                      fill="#EA4335"
                      d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.4-.1-2.7-.3-4z"
                    />
                  </g>
                </svg>
                {loading ? "Signing in..." : "Continue with Google"}
              </button>
              {googleError && (
                <div className="text-red-600 dark:text-red-400 text-xs px-4 py-2">
                  {googleError}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold border-b border-gray-100 dark:border-gray-700">
                {user.email}
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium rounded-b-xl"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
};

export default UserMenu;
