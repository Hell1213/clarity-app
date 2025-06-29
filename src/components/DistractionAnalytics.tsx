import { useState, useEffect } from "react";

interface DistractionData {
  id: string;
  type: string;
  frequency: number;
  totalTime: number;
  averageTime: number;
  category: "digital" | "physical" | "environmental" | "mental";
  icon: string;
  color: string;
}

interface DistractionAnalyticsProps {
  focusSessions: any[];
  distractions: any[];
}

export default function DistractionAnalytics({
  focusSessions,
  distractions,
}: DistractionAnalyticsProps) {
  const [distractionData, setDistractionData] = useState<DistractionData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [distractionFreeStreak, setDistractionFreeStreak] = useState(0);

  useEffect(() => {
    // Mock data - in real app, this would come from actual session data
    const mockDistractionData: DistractionData[] = [
      {
        id: "phone",
        type: "Phone Notifications",
        frequency: 12,
        totalTime: 45,
        averageTime: 3.75,
        category: "digital",
        icon: "📱",
        color: "bg-red-500",
      },
      {
        id: "social",
        type: "Social Media",
        frequency: 8,
        totalTime: 32,
        averageTime: 4,
        category: "digital",
        icon: "📱",
        color: "bg-blue-500",
      },
      {
        id: "noise",
        type: "Background Noise",
        frequency: 6,
        totalTime: 18,
        averageTime: 3,
        category: "environmental",
        icon: "🔊",
        color: "bg-yellow-500",
      },
      {
        id: "hunger",
        type: "Hunger/Thirst",
        frequency: 4,
        totalTime: 12,
        averageTime: 3,
        category: "physical",
        icon: "🍕",
        color: "bg-green-500",
      },
      {
        id: "thoughts",
        type: "Wandering Thoughts",
        frequency: 15,
        totalTime: 25,
        averageTime: 1.67,
        category: "mental",
        icon: "💭",
        color: "bg-purple-500",
      },
    ];

    setDistractionData(mockDistractionData);
    setDistractionFreeStreak(3); // Mock streak
  }, [focusSessions, distractions]);

  const getTotalDistractions = () => {
    return distractionData.reduce((sum, item) => sum + item.frequency, 0);
  };

  const getTotalDistractionTime = () => {
    return distractionData.reduce((sum, item) => sum + item.totalTime, 0);
  };

  const getTopDistraction = () => {
    return distractionData.reduce(
      (max, item) => (item.frequency > max.frequency ? item : max),
      distractionData[0]
    );
  };

  const getCategoryBreakdown = () => {
    const categories = ["digital", "physical", "environmental", "mental"];
    return categories.map((category) => ({
      category,
      count: distractionData.filter((item) => item.category === category)
        .length,
      totalTime: distractionData
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.totalTime, 0),
    }));
  };

  const getRecommendations = () => {
    const topDistraction = getTopDistraction();
    const recommendations = [];

    if (topDistraction?.type === "Phone Notifications") {
      recommendations.push("Enable Do Not Disturb mode during focus sessions");
      recommendations.push("Place phone in another room or use airplane mode");
      recommendations.push("Use apps like Forest or Focus@Will");
    } else if (topDistraction?.type === "Social Media") {
      recommendations.push("Use website blockers like Freedom or Cold Turkey");
      recommendations.push("Log out of social media accounts during work");
      recommendations.push("Schedule specific times for social media breaks");
    } else if (topDistraction?.type === "Background Noise") {
      recommendations.push("Use noise-canceling headphones");
      recommendations.push("Try white noise or ambient sounds");
      recommendations.push("Find a quieter workspace");
    } else if (topDistraction?.type === "Hunger/Thirst") {
      recommendations.push(
        "Have healthy snacks and water ready before sessions"
      );
      recommendations.push("Eat a proper meal before starting work");
      recommendations.push("Schedule meal breaks between focus sessions");
    } else if (topDistraction?.type === "Wandering Thoughts") {
      recommendations.push("Practice mindfulness or meditation");
      recommendations.push("Write down thoughts before starting work");
      recommendations.push("Use the Pomodoro technique with shorter breaks");
    }

    return recommendations;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          📊 Distraction Analytics
        </h3>
        <div className="flex gap-2">
          {["day", "week", "month"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                selectedTimeframe === timeframe
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                Total Distractions
              </p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {getTotalDistractions()}
              </p>
            </div>
            <span className="text-2xl">🚫</span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-300 font-medium">
                Time Lost
              </p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                {getTotalDistractionTime()}m
              </p>
            </div>
            <span className="text-2xl">⏰</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">
                Distraction-Free Streak
              </p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {distractionFreeStreak} days
              </p>
            </div>
            <span className="text-2xl">🔥</span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                Top Distraction
              </p>
              <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {getTopDistraction()?.type || "None"}
              </p>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
        </div>
      </div>

      {/* Top Distractions Chart */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-4">
          Top Distractions
        </h4>
        <div className="space-y-3">
          {distractionData
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5)
            .map((distraction) => (
              <div
                key={distraction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{distraction.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {distraction.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {distraction.frequency} times • {distraction.totalTime}m
                      total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {distraction.frequency}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    occurrences
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-4">
          Distraction Categories
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getCategoryBreakdown().map((category) => (
            <div
              key={category.category}
              className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">
                {category.category === "digital" && "💻"}
                {category.category === "physical" && "🏃"}
                {category.category === "environmental" && "🌍"}
                {category.category === "mental" && "🧠"}
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                {category.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category.count} types
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {category.totalTime}m total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Time Pattern Chart */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-4">
          Distraction Time Pattern
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-end justify-between h-32">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const height = Math.random() * 80 + 20; // Mock data
              return (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-4">
          💡 Recommendations
        </h4>
        <div className="space-y-2">
          {getRecommendations().map((recommendation) => (
            <div
              key={recommendation}
              className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <span className="text-blue-600 dark:text-blue-300 text-sm">
                •
              </span>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100">
              Distraction Reduction Goal
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Target: Reduce distractions by 25% this week
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              -15%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              vs last week
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Progress</span>
            <span>60%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
