import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { analyzeEmotion } from "../api/analyzeEmotion";
import { saveJournalEntry } from "../utils/firestore";
import VoiceToText from "./VoiceToText";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  mood?: string;
  suggestion?: string;
}

interface AIJournalChatProps {
  onEntrySaved?: (entry: any) => void;
}

const AIJournalChat: FC<AIJournalChatProps> = ({ onEntrySaved }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI journal companion. How are you feeling today? I'm here to listen, reflect, and help you gain insights from your thoughts. You can type or use voice input to share with me.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(transcript);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Enhanced mock AI response generation for better demo
    const lowerMessage = userMessage.toLowerCase();

    // Emotional responses
    if (
      lowerMessage.includes("sad") ||
      lowerMessage.includes("depressed") ||
      lowerMessage.includes("down")
    ) {
      const responses = [
        "I'm sorry you're feeling this way. It's completely normal to have difficult days. What do you think might help you feel a bit better right now?",
        "I hear you, and your feelings are valid. Sometimes it helps to acknowledge that it's okay to not be okay. Have you considered talking to someone you trust about this?",
        "Thank you for sharing this with me. Difficult emotions can be really challenging. What small thing could you do today to take care of yourself?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes("happy") ||
      lowerMessage.includes("excited") ||
      lowerMessage.includes("great")
    ) {
      const responses = [
        "That's wonderful! I'm so glad you're feeling positive. What do you think contributed to this good mood?",
        "This is fantastic! Positive emotions are worth celebrating. How can you build on this feeling?",
        "I love hearing about your happiness! What made today special for you?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("worried")
    ) {
      const responses = [
        "Stress and anxiety can be really challenging. Have you tried any breathing exercises or mindfulness techniques?",
        "I understand how overwhelming stress can feel. What's one small thing you could do right now to help yourself feel more grounded?",
        "Anxiety is tough to deal with. Sometimes it helps to break things down into smaller, manageable steps. What's the most pressing concern right now?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes("goal") ||
      lowerMessage.includes("achieve") ||
      lowerMessage.includes("success")
    ) {
      const responses = [
        "Setting goals is a great way to stay motivated! What steps can you take today to move closer to your goal?",
        "I love your ambition! Breaking down big goals into smaller actions often makes them more achievable. What's your next small step?",
        "Goals give us direction and purpose. How are you feeling about your progress so far?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes("tired") ||
      lowerMessage.includes("exhausted") ||
      lowerMessage.includes("burnout")
    ) {
      const responses = [
        "It sounds like you're really worn out. Rest is not a luxury—it's essential. What would help you recharge?",
        "Burnout is real and it's okay to acknowledge it. Sometimes the most productive thing we can do is rest. How can you prioritize self-care today?",
        "I hear how tired you are. Your body and mind are telling you something important. What would feel most restorative right now?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (
      lowerMessage.includes("relationship") ||
      lowerMessage.includes("friend") ||
      lowerMessage.includes("family")
    ) {
      const responses = [
        "Relationships can be complex and meaningful. How are you feeling about this connection?",
        "Human connections are so important for our wellbeing. What's working well in this relationship?",
        "Relationships often reflect our own growth. What are you learning about yourself through this connection?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // General thoughtful responses
    const generalResponses = [
      "That's really interesting. Can you tell me more about how that made you feel?",
      "I can sense some emotions in what you're sharing. What do you think triggered these feelings?",
      "Thank you for sharing that with me. How do you think this experience might help you grow?",
      "I hear you. Sometimes it helps to explore these thoughts further. What would you like to focus on?",
      "That sounds challenging. What strategies have you found helpful in similar situations?",
      "I appreciate you opening up about this. What would be most helpful for you right now?",
      "Your thoughts are valuable. How are you processing this experience?",
      "I'm here to listen. What's the most important thing you want to explore about this?",
    ];

    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setIsAnalyzing(true);

    try {
      // Analyze emotion
      const emotionResult = await analyzeEmotion(inputText);

      // Generate AI response
      const aiResponse = await generateAIResponse(inputText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        mood: emotionResult.mood,
        suggestion: emotionResult.suggestion,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save to Firestore
      if (user) {
        const entryData = {
          content: inputText,
          mood: emotionResult.mood,
          suggestion: emotionResult.suggestion,
          aiResponse: aiResponse,
          timestamp: new Date(),
          userId: user.uid,
        };

        await saveJournalEntry(entryData);
        onEntrySaved?.(entryData);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I'm having trouble processing that right now. Could you try again?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      anxious: "😰",
      excited: "🤩",
      calm: "😌",
      stressed: "😰",
      grateful: "🙏",
      neutral: "😐",
    };
    return moodEmojis[mood.toLowerCase()] || "🤔";
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900 dark:to-purple-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Journal Companion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your personal wellness assistant
            </p>
          </div>
        </div>
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.mood && message.type === "ai" && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 text-xs">
                    <span>{getMoodEmoji(message.mood)}</span>
                    <span className="capitalize font-medium">
                      {message.mood}
                    </span>
                  </div>
                  {message.suggestion && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      💡 {message.suggestion}
                    </p>
                  )}
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts, feelings, or ask me anything..."
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={2}
            disabled={isTyping || isListening}
          />
          <div className="flex flex-col space-y-2">
            <VoiceToText
              onTranscript={handleVoiceTranscript}
              isListening={isListening}
              onListeningChange={setIsListening}
              disabled={isTyping || !isOnline}
            />
            {!isOnline && (
              <div className="text-xs text-orange-600 dark:text-orange-400 text-center">
                Offline - Voice input unavailable
              </div>
            )}
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping || isListening}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line, or use voice input
        </p>
      </div>
    </div>
  );
};

export default AIJournalChat;
