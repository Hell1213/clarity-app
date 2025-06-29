import { useState, useEffect } from "react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "focus" | "streak" | "milestone" | "special";
  requirement: number;
  achieved: boolean;
  achievedDate?: Date;
}

interface AchievementBadgesProps {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalFocusTime: number;
}

export default function AchievementBadges({
  totalSessions,
  currentStreak,
  longestStreak,
  totalFocusTime,
}: AchievementBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const allBadges: Badge[] = [
      // Focus Session Badges
      {
        id: "first-session",
        name: "First Steps",
        description: "Complete your first focus session",
        icon: "🎯",
        category: "focus",
        requirement: 1,
        achieved: totalSessions >= 1,
      },
      {
        id: "10-sessions",
        name: "Getting Started",
        description: "Complete 10 focus sessions",
        icon: "🚀",
        category: "focus",
        requirement: 10,
        achieved: totalSessions >= 10,
      },
      {
        id: "50-sessions",
        name: "Consistent Learner",
        description: "Complete 50 focus sessions",
        icon: "📚",
        category: "focus",
        requirement: 50,
        achieved: totalSessions >= 50,
      },
      {
        id: "100-sessions",
        name: "Century Club",
        description: "Complete 100 focus sessions",
        icon: "🏆",
        category: "focus",
        requirement: 100,
        achieved: totalSessions >= 100,
      },
      {
        id: "500-sessions",
        name: "Master of Focus",
        description: "Complete 500 focus sessions",
        icon: "👑",
        category: "focus",
        requirement: 500,
        achieved: totalSessions >= 500,
      },

      // Streak Badges
      {
        id: "3-day-streak",
        name: "Weekend Warrior",
        description: "Maintain a 3-day focus streak",
        icon: "🔥",
        category: "streak",
        requirement: 3,
        achieved: longestStreak >= 3,
      },
      {
        id: "7-day-streak",
        name: "Week Warrior",
        description: "Maintain a 7-day focus streak",
        icon: "⚡",
        category: "streak",
        requirement: 7,
        achieved: longestStreak >= 7,
      },
      {
        id: "14-day-streak",
        name: "Fortnight Fighter",
        description: "Maintain a 14-day focus streak",
        icon: "💪",
        category: "streak",
        requirement: 14,
        achieved: longestStreak >= 14,
      },
      {
        id: "30-day-streak",
        name: "Monthly Master",
        description: "Maintain a 30-day focus streak",
        icon: "🌟",
        category: "streak",
        requirement: 30,
        achieved: longestStreak >= 30,
      },
      {
        id: "100-day-streak",
        name: "Century Streak",
        description: "Maintain a 100-day focus streak",
        icon: "💎",
        category: "streak",
        requirement: 100,
        achieved: longestStreak >= 100,
      },

      // Time-based Badges
      {
        id: "1-hour-total",
        name: "Hour Hero",
        description: "Accumulate 1 hour of total focus time",
        icon: "⏰",
        category: "milestone",
        requirement: 60,
        achieved: totalFocusTime >= 60,
      },
      {
        id: "10-hours-total",
        name: "Decade of Focus",
        description: "Accumulate 10 hours of total focus time",
        icon: "📊",
        category: "milestone",
        requirement: 600,
        achieved: totalFocusTime >= 600,
      },
      {
        id: "100-hours-total",
        name: "Century of Time",
        description: "Accumulate 100 hours of total focus time",
        icon: "🎖️",
        category: "milestone",
        requirement: 6000,
        achieved: totalFocusTime >= 6000,
      },

      // Special Badges
      {
        id: "perfect-day",
        name: "Perfect Day",
        description: "Complete all daily goals in one day",
        icon: "✨",
        category: "special",
        requirement: 1,
        achieved: false, // This would need to be calculated based on daily goal completion
      },
      {
        id: "early-bird",
        name: "Early Bird",
        description: "Complete a focus session before 8 AM",
        icon: "🌅",
        category: "special",
        requirement: 1,
        achieved: false, // This would need session time data
      },
      {
        id: "night-owl",
        name: "Night Owl",
        description: "Complete a focus session after 10 PM",
        icon: "🦉",
        category: "special",
        requirement: 1,
        achieved: false, // This would need session time data
      },
    ];

    setBadges(allBadges);
  }, [totalSessions, currentStreak, longestStreak, totalFocusTime]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "focus":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "streak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "milestone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "special":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "focus":
        return "🎯";
      case "streak":
        return "🔥";
      case "milestone":
        return "📊";
      case "special":
        return "✨";
      default:
        return "🏅";
    }
  };

  const achievedBadges = badges.filter((badge) => badge.achieved);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary-700 dark:text-primary-300">
          🏆 Achievements
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {achievedBadges.length}
          </div>
          <div className="text-sm text-gray-500">of {badges.length} badges</div>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {Math.round((achievedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(achievedBadges.length / badges.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "focus", "streak", "milestone", "special"].map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              category === "all"
                ? "bg-primary-100 text-primary-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category === "all"
              ? "All"
              : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 w-full mx-auto break-words ${
              badge.achieved
                ? "border-green-200 bg-green-50 shadow-md"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            {/* Badge Icon */}
            <div className="text-center mb-3">
              <div
                className={`text-3xl mb-2 ${badge.achieved ? "" : "grayscale"}`}
              >
                {badge.icon}
              </div>
              {badge.achieved && (
                <div className="absolute top-2 right-2">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              )}
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h4
                className={`font-bold mb-1 ${
                  badge.achieved ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {badge.name}
              </h4>
              <p
                className={`text-xs mb-2 ${
                  badge.achieved ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {badge.description}
              </p>

              {/* Category Tag */}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  badge.category
                )}`}
              >
                {getCategoryIcon(badge.category)} {badge.category}
              </span>
            </div>

            {/* Progress Indicator for Unachieved Badges */}
            {!badge.achieved && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {badge.category === "focus" && totalSessions}/
                    {badge.requirement}
                    {badge.category === "streak" && longestStreak}/
                    {badge.requirement}
                    {badge.category === "milestone" &&
                      Math.floor(totalFocusTime / 60)}
                    /{Math.floor(badge.requirement / 60)}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-gray-400 h-1 rounded-full"
                    style={{
                      width: `${Math.min(
                        badge.category === "focus"
                          ? (totalSessions / badge.requirement) * 100
                          : badge.category === "streak"
                          ? (longestStreak / badge.requirement) * 100
                          : badge.category === "milestone"
                          ? (totalFocusTime / badge.requirement) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-800">Recent Achievement</h4>
            <p className="text-sm text-gray-600">
              {achievedBadges.length > 0
                ? `You've earned ${achievedBadges.length} badge${
                    achievedBadges.length > 1 ? "s" : ""
                  }!`
                : "Complete your first session to earn your first badge!"}
            </p>
          </div>
          <div className="text-2xl">
            {achievedBadges.length > 0 ? "🎉" : "🌟"}
          </div>
        </div>
      </div>
    </div>
  );
}
