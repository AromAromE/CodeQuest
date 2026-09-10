"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { FloatingNumber } from "@/types/game";

export function FloatingFX() {
  const floatingNumbers = useGameStore((state) => state.floatingNumbers);
  const removeFloatingNumber = useGameStore((state) => state.removeFloatingNumber);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {floatingNumbers.map((item) => (
        <FloatingItem key={item.id} item={item} onComplete={() => removeFloatingNumber(item.id)} />
      ))}
    </div>
  );
}

function FloatingItem({ item, onComplete }: { item: FloatingNumber; onComplete: () => void }) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getColorClass = () => {
    switch (item.type) {
      case "xp":
        return "text-cyan-400 text-glow-cyan text-2xl font-black";
      case "coin":
        return "text-amber-400 text-glow-gold text-2xl font-black";
      case "combo":
        return "text-purple-400 text-glow-purple text-3xl font-black italic tracking-wider animate-bounce";
      case "damage":
        return "text-rose-500 text-glow-rose text-3xl font-black";
      default:
        return "text-white text-xl font-bold";
    }
  };

  return (
    <div
      ref={itemRef}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        animation: "floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      }}
      className={`absolute select-none transform -translate-x-1/2 -translate-y-1/2 ${getColorClass()}`}
    >
      <style jsx>{`
        @keyframes floatUpFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px) scale(0.6);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -20px) scale(1.25);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -60px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -90px) scale(0.8);
          }
        }
      `}</style>
      {item.text}
    </div>
  );
}
