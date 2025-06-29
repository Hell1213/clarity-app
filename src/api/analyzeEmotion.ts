import type { MoodAnalysis } from "../types";

// Mock emotion analysis for when OpenAI API is unavailable
const mockAnalyzeEmotion = (text: string): MoodAnalysis => {
  const lowerText = text.toLowerCase();

  // Simple keyword-based analysis
  if (
    lowerText.includes("happy") ||
    lowerText.includes("great") ||
    lowerText.includes("excited")
  ) {
    return {
      mood: "happy",
      suggestion: "Keep up the positive energy! 🌟",
    };
  }

  if (
    lowerText.includes("sad") ||
    lowerText.includes("depressed") ||
    lowerText.includes("down")
  ) {
    return {
      mood: "sad",
      suggestion: "It's okay to feel this way. Take care of yourself. 💙",
    };
  }

  if (
    lowerText.includes("stress") ||
    lowerText.includes("anxious") ||
    lowerText.includes("worried")
  ) {
    return {
      mood: "anxious",
      suggestion: "Try some deep breathing exercises. 🧘‍♀️",
    };
  }

  if (
    lowerText.includes("angry") ||
    lowerText.includes("frustrated") ||
    lowerText.includes("mad")
  ) {
    return {
      mood: "angry",
      suggestion: "Take a moment to pause and breathe. 😤",
    };
  }

  if (
    lowerText.includes("tired") ||
    lowerText.includes("exhausted") ||
    lowerText.includes("burnout")
  ) {
    return {
      mood: "tired",
      suggestion: "Rest is essential. Give yourself permission to recharge. 😴",
    };
  }

  // Default response
  return {
    mood: "neutral",
    suggestion: "Thanks for sharing your thoughts. 📝",
  };
};

export const analyzeEmotion = async (
  journalText: string
): Promise<MoodAnalysis> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: journalText }),
    });

    if (!response.ok) {
      // If API fails, use mock analysis
      console.log("OpenAI API unavailable, using mock analysis");
      return mockAnalyzeEmotion(journalText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    // Fallback to mock analysis
    console.log("Falling back to mock emotion analysis");
    return mockAnalyzeEmotion(journalText);
  }
};
