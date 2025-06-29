import { useState, useRef, useEffect } from "react";

interface UseTimerOptions {
  duration: number; // in minutes
  onComplete?: () => void;
}

export function useTimer({ duration, onComplete }: UseTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Update timer when duration changes
  useEffect(() => {
    setSecondsLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
  };

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    setSecondsLeft,
    setIsRunning,
  };
}
