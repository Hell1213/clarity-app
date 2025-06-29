import type { FC } from "react";
import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from "date-fns";
import type { JournalEntry } from "../types";
import { moodToColor } from "../utils/sentimentLabels";

interface MoodCalendarProps {
  entries: JournalEntry[];
}

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const MoodCalendar: FC<MoodCalendarProps> = ({ entries }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Map dates to entries for quick lookup
  const entryMap = useMemo(() => {
    const map: Record<string, JournalEntry> = {};
    entries.forEach((e) => {
      const dateStr =
        typeof e.date === "string" ? e.date : format(e.timestamp, "yyyy-MM-dd");
      map[dateStr] = e;
    });
    return map;
  }, [entries]);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart); // 0 (Sun) - 6 (Sat)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
        Mood Calendar
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((d, index) => (
          <div
            key={`day-${index}`}
            className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for first week offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const entry = entryMap[dateStr];
          const isToday = isSameDay(day, today);
          return (
            <button
              key={dateStr}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150 text-gray-800 dark:text-gray-100 ${
                entry ? moodToColor(entry.mood) : "bg-gray-100 dark:bg-gray-800"
              } ${
                isToday ? "ring-2 ring-primary-500 dark:ring-primary-400" : ""
              }`}
              title={entry ? `${entry.mood}: ${entry.suggestion}` : "No entry"}
              onClick={() => setSelectedDate(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      {/* Entry details popup */}
      {selectedDate &&
        (() => {
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          const entry = entryMap[dateStr];
          return (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-primary-700 dark:text-primary-300">
                  {format(selectedDate, "MMM d, yyyy")}
                </span>
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  onClick={() => setSelectedDate(null)}
                >
                  Close
                </button>
              </div>
              {entry ? (
                <>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      Mood:
                    </span>{" "}
                    <span className="capitalize text-gray-700 dark:text-gray-200">
                      {entry.mood}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      Suggestion:
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-200">
                      {entry.suggestion}
                    </span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 mt-2">
                    {entry.content}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No journal entry for this day.
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
};

export default MoodCalendar;
