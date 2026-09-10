"use client";

import { useGameStore } from "@/lib/store";
import {
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  GitBranch,
  Award,
  BookOpen,
} from "lucide-react";

export function TopNav() {
  const user = useGameStore((state) => state.user);
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleSoundMute = useGameStore((state) => state.toggleSoundMute);
  const openChest = useGameStore((state) => state.openChest);

  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider text-white text-glow-cyan">
                CODE<span className="text-cyan-400">QUEST</span>
              </h1>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-cyan-300">
                RPG V1.0
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">Dopamine Engineering Engine</p>
          </div>
        </div>

        {/* Global Level & Glowing XP Bar */}
        <div className="hidden lg:flex items-center gap-3 w-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 font-mono text-sm font-black text-cyan-400 ring-1 ring-cyan-500/50">
            {user.level}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-300">Level {user.level}</span>
              <span className="font-mono text-cyan-400">{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(0,240,255,0.7)] transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Stats: Streak, Coins, Combo & Sound */}
        <div className="flex items-center gap-3">
          {/* Combo Multiplier pill */}
          {user.comboMultiplier > 1 && (
            <div className="flex items-center gap-1 rounded-xl bg-purple-950/80 px-2.5 py-1.5 text-xs font-black text-purple-300 ring-1 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-bounce">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>x{user.comboMultiplier.toFixed(1)} COMBO</span>
            </div>
          )}

          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-black text-amber-400 ring-1 ring-amber-500/30">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-400 animate-pulse" />
            <span>{user.streakDays}d Streak</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-black text-amber-300 ring-1 ring-slate-800">
            <Coins className="h-4 w-4 text-amber-400" />
            <span>{user.coins}</span>
          </div>

          {/* Open Test Chest */}
          <button
            onClick={() => openChest("legendary")}
            className="hidden sm:flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" /> Loot Box
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSoundMute}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:text-white"
            title={isMuted ? "Unmute SFX" : "Mute SFX"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
