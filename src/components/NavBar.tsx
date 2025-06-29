import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="w-full bg-white dark:bg-gray-900 shadow-sm py-3 px-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-md font-semibold px-2 py-1 rounded transition ${
                isActive
                  ? "text-primary-700 dark:text-primary-300 border-b-2 border-primary-700 dark:border-primary-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/focus"
            className={({ isActive }) =>
              `text-md font-semibold px-2 py-1 rounded transition ${
                isActive
                  ? "text-primary-700 dark:text-primary-300 border-b-2 border-primary-700 dark:border-primary-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`
            }
          >
            Focus
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `text-md font-semibold px-2 py-1 rounded transition ${
                isActive
                  ? "text-primary-700 dark:text-primary-300 border-b-2 border-primary-700 dark:border-primary-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`
            }
          >
            Journal
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `text-md font-semibold px-2 py-1 rounded transition ${
                isActive
                  ? "text-primary-700 dark:text-primary-300 border-b-2 border-primary-700 dark:border-primary-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`
            }
          >
            Settings
          </NavLink>
        </div>

        {/* User Menu & Theme Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
