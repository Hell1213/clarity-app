import type { FC } from "react";
import { useState, useRef, useEffect } from "react";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceToTextProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  disabled?: boolean;
}

const VoiceToText: FC<VoiceToTextProps> = ({
  onTranscript,
  isListening,
  onListeningChange,
  disabled = false,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const recognitionRef = useRef<any>(null);

  const maxRetries = 3;

  const clearError = () => {
    setError(null);
    setRetryCount(0);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setError(null);
      setTimeout(() => {
        toggleListening();
      }, 1000); // Wait 1 second before retrying
    } else {
      setError(
        "Voice input is temporarily unavailable. Please use text input instead."
      );
    }
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript);
          onListeningChange(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);

        // Handle specific error types
        let errorMessage = "Speech recognition error";
        switch (event.error) {
          case "network":
            errorMessage =
              "Network error. Please check your internet connection and try again.";
            break;
          case "not-allowed":
            errorMessage =
              "Microphone access denied. Please allow microphone permissions.";
            break;
          case "no-speech":
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case "audio-capture":
            errorMessage = "Audio capture error. Please check your microphone.";
            break;
          case "service-not-allowed":
            errorMessage = "Speech recognition service not available.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        setError(errorMessage);
        onListeningChange(false);
      };

      recognitionRef.current.onend = () => {
        onListeningChange(false);
      };
    } else {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser");
    }
  }, [onTranscript, onListeningChange]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      recognitionRef.current?.stop();
      onListeningChange(false);
    } else {
      setError(null);
      try {
        // Check if we're online before starting
        if (!navigator.onLine) {
          setError(
            "No internet connection. Voice input requires an internet connection."
          );
          return;
        }

        recognitionRef.current?.start();
        onListeningChange(true);
      } catch (err) {
        console.error("Failed to start voice recognition:", err);
        setError("Failed to start voice recognition. Please try again.");
        onListeningChange(false);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-red-500 text-white animate-pulse shadow-lg"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={isListening ? "Stop recording" : "Start voice input"}
      >
        {isListening ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {isListening && (
        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
          Listening... Speak now
        </div>
      )}

      {!isListening && !error && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Requires internet & microphone
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 dark:text-red-400 text-center max-w-xs">
          <p className="mb-2">{error}</p>
          {error.includes("Network error") && retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="text-primary-600 dark:text-primary-400 hover:underline text-xs"
            >
              Retry ({maxRetries - retryCount} attempts left)
            </button>
          )}
          {!error.includes("Network error") && (
            <button
              onClick={clearError}
              className="text-gray-500 dark:text-gray-400 hover:underline text-xs"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
