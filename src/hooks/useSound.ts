import { useCallback, useRef } from "react";

type SoundType =
  | "timer-complete"
  | "session-start"
  | "notification"
  | "break-start"
  | "focus-start"
  | "pause"
  | "reset";

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }, []);

  const createBeepSound = useCallback(
    (frequency: number, duration: number, volume: number = 0.3) => {
      initAudio();
      if (!audioContextRef.current) return;

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + duration
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    },
    [initAudio]
  );

  const playTimerComplete = useCallback(() => {
    // Play a sequence of beeps for timer completion
    createBeepSound(800, 0.2);
    setTimeout(() => createBeepSound(1000, 0.2), 200);
    setTimeout(() => createBeepSound(1200, 0.3), 400);
  }, [createBeepSound]);

  const playSessionStart = useCallback(() => {
    // Play a single beep for session start
    createBeepSound(600, 0.1);
  }, [createBeepSound]);

  const playNotification = useCallback(() => {
    // Play a gentle notification sound
    createBeepSound(400, 0.15);
    setTimeout(() => createBeepSound(500, 0.15), 150);
  }, [createBeepSound]);

  const playBreakStart = useCallback(() => {
    // Play a relaxing sound for break start
    createBeepSound(300, 0.1, 0.2);
    setTimeout(() => createBeepSound(400, 0.1, 0.2), 100);
    setTimeout(() => createBeepSound(500, 0.2, 0.2), 200);
  }, [createBeepSound]);

  const playFocusStart = useCallback(() => {
    // Play an energizing sound for focus start
    createBeepSound(600, 0.1, 0.3);
    setTimeout(() => createBeepSound(800, 0.1, 0.3), 100);
  }, [createBeepSound]);

  const playPause = useCallback(() => {
    // Play a gentle pause sound
    createBeepSound(400, 0.1, 0.2);
  }, [createBeepSound]);

  const playReset = useCallback(() => {
    // Play a reset sound
    createBeepSound(200, 0.1, 0.2);
    setTimeout(() => createBeepSound(300, 0.1, 0.2), 100);
  }, [createBeepSound]);

  const playSound = useCallback(
    (type: SoundType) => {
      try {
        switch (type) {
          case "timer-complete":
            playTimerComplete();
            break;
          case "session-start":
            playSessionStart();
            break;
          case "notification":
            playNotification();
            break;
          case "break-start":
            playBreakStart();
            break;
          case "focus-start":
            playFocusStart();
            break;
          case "pause":
            playPause();
            break;
          case "reset":
            playReset();
            break;
        }
      } catch (error) {
        console.warn("Could not play sound:", error);
      }
    },
    [
      playTimerComplete,
      playSessionStart,
      playNotification,
      playBreakStart,
      playFocusStart,
      playPause,
      playReset,
    ]
  );

  return {
    playSound,
    playTimerComplete,
    playSessionStart,
    playNotification,
    playBreakStart,
    playFocusStart,
    playPause,
    playReset,
  };
}
