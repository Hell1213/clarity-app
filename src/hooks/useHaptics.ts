import { useCallback } from "react";

interface HapticPattern {
  light: number[];
  medium: number[];
  heavy: number[];
  success: number[];
  error: number[];
  warning: number[];
}

const HAPTIC_PATTERNS: HapticPattern = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [50, 100, 50],
  error: [100, 50, 100, 50, 100],
  warning: [100, 50, 100],
};

interface UseHapticsReturn {
  isSupported: boolean;
  vibrate: (pattern?: number | number[]) => void;
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  error: () => void;
  warning: () => void;
  stop: () => void;
}

export function useHaptics(): UseHapticsReturn {
  // Check if vibration is supported
  const isSupported =
    typeof navigator !== "undefined" && "vibrate" in navigator;

  // Generic vibrate function
  const vibrate = useCallback(
    (pattern?: number | number[]) => {
      if (!isSupported) return;

      try {
        if (pattern) {
          navigator.vibrate(pattern);
        } else {
          navigator.vibrate(100);
        }
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    },
    [isSupported]
  );

  // Light haptic feedback
  const light = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.light);
  }, [vibrate]);

  // Medium haptic feedback
  const medium = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.medium);
  }, [vibrate]);

  // Heavy haptic feedback
  const heavy = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.heavy);
  }, [vibrate]);

  // Success haptic feedback
  const success = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.success);
  }, [vibrate]);

  // Error haptic feedback
  const error = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.error);
  }, [vibrate]);

  // Warning haptic feedback
  const warning = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.warning);
  }, [vibrate]);

  // Stop vibration
  const stop = useCallback(() => {
    if (!isSupported) return;

    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn("Failed to stop haptic feedback:", error);
    }
  }, [isSupported]);

  return {
    isSupported,
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    stop,
  };
}
