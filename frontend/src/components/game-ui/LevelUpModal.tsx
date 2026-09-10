"use client";

import { useGameStore } from "@/lib/store";
import { Sparkles, Trophy, X, ArrowUpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function LevelUpModal() {
  const levelUpModalOpen = useGameStore((state) => state.levelUpModalOpen);
  const leveledUpTo = useGameStore((state) => state.leveledUpTo);
  const closeLevelUpModal = useGameStore((state) => state.closeLevelUpModal);

  useEffect(() => {
    if (levelUpModalOpen) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#00f0ff", "#eab308", "#a855f7", "#10b981"],
      });
    }
  }, [levelUpModalOpen]);

  if (!levelUpModalOpen || !leveledUpTo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in zoom-in-95 duration-300">
      <div className="glass-panel-gold relative w-full max-w-sm rounded-3xl p-6 text-center ring-2 ring-amber-400/80 shadow-[0_0_60px_rgba(234,179,8,0.5)]">
        <button
          onClick={closeLevelUpModal}
          className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-1 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="my-2 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.8)] animate-bounce">
            <ArrowUpCircle className="h-14 w-14 text-slate-950" />
            <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-cyan-300 animate-spin" />
          </div>
        </div>

        <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
          LEVEL UP ACHIEVED!
        </span>

        <h3 className="mt-2 text-3xl font-black text-white text-glow-gold">
          LEVEL {leveledUpTo}
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          Your developer mastery surges! New rewards, avatars, and garden slots unlocked!
        </p>

        <button
          onClick={closeLevelUpModal}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:scale-105 active:scale-95"
        >
          CONTINUE CODING
        </button>
      </div>
    </div>
  );
}
