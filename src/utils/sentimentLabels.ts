import type { JournalEntry } from "../types";
import { format, subDays, isSameDay, parseISO } from "date-fns";

// Calculate the current streak of consecutive days with a journal entry
export function calculateJournalStreak(entries: JournalEntry[]): number {
  if (!entries.length) return 0;
  // Get unique dates (YYYY-MM-DD)
  const dates = Array.from(
    new Set(
      entries.map((e) =>
        typeof e.date === "string" ? e.date : format(e.timestamp, "yyyy-MM-dd")
      )
    )
  )
    .sort()
    .reverse();
  let streak = 0;
  let today = new Date();

  for (let i = 0; i < dates.length; i++) {
    const entryDate = parseISO(dates[i]);
    if (isSameDay(entryDate, subDays(today, streak))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Map mood to Tailwind color class
export function moodToColor(mood: string): string {
  switch (mood?.toLowerCase()) {
    case "happy":
      return "bg-green-400";
    case "calm":
      return "bg-blue-400";
    case "neutral":
      return "bg-gray-300";
    case "sad":
      return "bg-blue-700";
    case "angry":
      return "bg-red-500";
    case "anxious":
      return "bg-yellow-400";
    case "tired":
      return "bg-purple-400";
    case "excited":
      return "bg-pink-400";
    default:
      return "bg-gray-200";
  }
}
