"use client";

import { useGameStore } from "@/lib/store";
import { Package, Sparkles, X, Gift } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function LootChestModal() {
  const chestModalOpen = useGameStore((state) => state.chestModalOpen);
  const openedLootItem = useGameStore((state) => state.openedLootItem);
  const closeChestModal = useGameStore((state) => state.closeChestModal);

  useEffect(() => {
    if (chestModalOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#eab308", "#a855f7", "#f43f5e", "#10b981"],
      });
    }
  }, [chestModalOpen]);

  if (!chestModalOpen || !openedLootItem) return null;

  const getRarityGlow = () => {
    switch (openedLootItem.rarity) {
      case "mythic":
        return "ring-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)] text-rose-400";
      case "legendary":
        return "ring-amber-500 shadow-[0_0_50px_rgba(234,179,8,0.6)] text-amber-400";
      case "epic":
        return "ring-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] text-purple-400";
      case "rare":
        return "ring-cyan-500 shadow-[0_0_30px_rgba(0,240,255,0.4)] text-cyan-400";
      default:
        return "ring-slate-500 shadow-lg text-slate-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div
        className={`glass-panel relative w-full max-w-sm rounded-3xl p-6 text-center ring-2 ${getRarityGlow()}`}
      >
        <button
          onClick={closeChestModal}
          className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-1 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="my-3 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900 ring-2 ring-white/20 animate-bounce">
            <Gift className="h-12 w-12 text-amber-400" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-cyan-400 animate-spin" />
          </div>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest">
          {openedLootItem.rarity} DROP!
        </span>

        <h3 className="mt-3 text-xl font-black text-white">{openedLootItem.name}</h3>
        <p className="mt-1 text-xs text-slate-300">{openedLootItem.description}</p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={closeChestModal}
            className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:scale-105 active:scale-95"
          >
            CLAIM TO INVENTORY
          </button>
        </div>
      </div>
    </div>
  );
}
