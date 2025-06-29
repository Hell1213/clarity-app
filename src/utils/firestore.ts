import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { FocusSession, JournalEntry } from "../types";
import { format } from "date-fns";

// Mock data for offline/fallback scenarios
const mockFocusSessions: FocusSession[] = [
  {
    id: "mock-1",
    userId: "user123",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    duration: 25,
    mood: "happy",
    label: "Study Session",
    note: "Focused on React development",
    breakDuration: 5,
    comment: "Great productivity today!",
    completed: true,
  },
  {
    id: "mock-2",
    userId: "user123",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    duration: 30,
    mood: "neutral",
    label: "Work Session",
    note: "Completed project tasks",
    breakDuration: 5,
    comment: "Steady progress",
    completed: true,
  },
];

const mockJournalEntries: JournalEntry[] = [
  {
    id: "mock-1",
    userId: "user123",
    timestamp: new Date(Date.now() - 86400000),
    content:
      "Had a productive day working on my project. Feeling accomplished!",
    mood: "happy",
    suggestion: "Keep up the great work! Your consistency is paying off.",
    date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"),
  },
  {
    id: "mock-2",
    userId: "user123",
    timestamp: new Date(Date.now() - 172800000),
    content: "Feeling a bit tired today but managed to get some work done.",
    mood: "neutral",
    suggestion: "Consider taking a short break to recharge.",
    date: format(new Date(Date.now() - 172800000), "yyyy-MM-dd"),
  },
];

// Helper function to check if Firebase is available
const isFirebaseAvailable = () => {
  return db && typeof window !== "undefined" && navigator.onLine;
};

// Save a focus session to Firestore
export const saveFocusSession = async (session: Omit<FocusSession, "id">) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - session not saved");
    return "demo-session-id";
  }

  try {
    const docRef = await addDoc(collection(db!, "focusSessions"), {
      ...session,
      timestamp: Timestamp.fromDate(session.timestamp),
      label: session.label || "",
      note: session.note || "",
      breakDuration: session.breakDuration || 5,
      comment: session.comment || "",
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving focus session:", error);
    // Return mock ID on error to prevent app crashes
    return "demo-session-id";
  }
};

// Save a journal entry to Firestore (add 'date' field for streaks)
export const saveJournalEntry = async (entry: Omit<JournalEntry, "id">) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - entry not saved");
    return "demo-entry-id";
  }

  try {
    const date = format(entry.timestamp, "yyyy-MM-dd");
    const docRef = await addDoc(collection(db!, "journalEntries"), {
      ...entry,
      timestamp: Timestamp.fromDate(entry.timestamp),
      date, // Add date for streaks
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving journal entry:", error);
    // Return mock ID on error to prevent app crashes
    return "demo-entry-id";
  }
};

// Get recent focus sessions for a user
export const getRecentFocusSessions = async (
  userId: string,
  limitCount: number = 10
) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - returning mock data");
    return mockFocusSessions.slice(0, limitCount);
  }

  try {
    const q = query(
      collection(db!, "focusSessions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as FocusSession[];

    // Return mock data if no real data found
    return sessions.length > 0
      ? sessions
      : mockFocusSessions.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting focus sessions:", error);
    // Return mock data on error
    return mockFocusSessions.slice(0, limitCount);
  }
};

// Get recent journal entries for a user
export const getRecentJournalEntries = async (
  userId: string,
  limitCount: number = 10
) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - returning mock data");
    return mockJournalEntries.slice(0, limitCount);
  }

  try {
    const q = query(
      collection(db!, "journalEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as JournalEntry[];

    // Return mock data if no real data found
    return entries.length > 0
      ? entries
      : mockJournalEntries.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting journal entries:", error);
    // Return mock data on error
    return mockJournalEntries.slice(0, limitCount);
  }
};

// Get recent mood entries for a user
export const getRecentMoodEntries = async (
  userId: string,
  limitCount: number = 30
) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - returning empty mood data");
    return [];
  }

  try {
    const q = query(
      collection(db!, "moodEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting mood entries:", error);
    return [];
  }
};

// Get all journal entries for a user (for history view)
export const getJournalEntries = async (userId: string) => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available - returning mock data");
    return mockJournalEntries;
  }

  try {
    const q = query(
      collection(db!, "journalEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as JournalEntry[];

    // Return mock data if no real data found
    return entries.length > 0 ? entries : mockJournalEntries;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    // Return mock data on error
    return mockJournalEntries;
  }
};
