import { useEffect, useState } from "react";

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocity: number;
  delay: number;
}

const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#feca57",
  "#ff9ff3",
  "#54a0ff",
  "#5f27cd",
];

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles
      const newParticles: ConfettiParticle[] = Array.from(
        { length: 50 },
        (_, i) => ({
          id: i,
          x: Math.random() * 100, // percentage across screen
          y: -10, // start above screen
          size: Math.random() * 8 + 4, // 4-12px
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          velocity: Math.random() * 2 + 1, // fall speed
          delay: Math.random() * 500, // stagger animation
        })
      );

      setParticles(newParticles);

      // Trigger completion callback after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-transparent dark:bg-transparent">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: "50%",
            transform: `rotate(${particle.rotation}deg)`,
            animationDuration: `${2 + particle.velocity}s`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
