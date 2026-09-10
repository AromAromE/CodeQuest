"use client";

import { useGameStore } from "@/lib/store";
import { Swords, Skull, ShieldAlert, Zap, Trophy } from "lucide-react";

export function BossArena() {
  const boss = useGameStore((state) => state.boss);
  const strikeBossDirectly = useGameStore((state) => state.strikeBossDirectly);
  const openChest = useGameStore((state) => state.openChest);

  const hpPercentage = Math.round((boss.currentHp / boss.maxHp) * 100);

  const renderBossSvg = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
        <defs>
          <radialGradient id="bossCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#881337" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        {/* Dragon Wings */}
        <polygon points="100,80 20,40 40,110 80,110" fill="#9f1239" opacity="0.85" />
        <polygon points="100,80 180,40 160,110 120,110" fill="#9f1239" opacity="0.85" />
        {/* Wing bones */}
        <line x1="100" y1="80" x2="20" y2="40" stroke="#f43f5e" strokeWidth="3" />
        <line x1="100" y1="80" x2="180" y2="40" stroke="#f43f5e" strokeWidth="3" />
        {/* Body & Head */}
        <ellipse cx="100" cy="115" rx="35" ry="45" fill="url(#bossCore)" stroke="#f43f5e" strokeWidth="2" />
        {/* Dragon Horns */}
        <polygon points="80,70 65,30 90,60" fill="#f43f5e" />
        <polygon points="120,70 135,30 110,60" fill="#f43f5e" />
        {/* Glowing Eyes */}
        <circle cx="85" cy="85" r="5" fill="#fef08a" className="animate-ping" style={{ animationDuration: "1.5s" }} />
        <circle cx="115" cy="85" r="5" fill="#fef08a" className="animate-ping" style={{ animationDuration: "1.5s" }} />
        <circle cx="85" cy="85" r="4" fill="#fbbf24" />
        <circle cx="115" cy="85" r="4" fill="#fbbf24" />
        {/* Fire Breath / Fangs */}
        <polygon points="90,105 100,120 110,105 100,112" fill="#e11d48" />
      </svg>
    );
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 border border-rose-500/30">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400">
            <Skull className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-rose-400 uppercase">WEEKLY RAID BOSS</span>
            <h3 className="text-lg font-black text-white">{boss.name}</h3>
          </div>
        </div>
        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-300 ring-1 ring-slate-700">
          ⏳ {boss.weeklyDeadline}
        </span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
        {/* Animated Boss Monster Frame */}
        <div className="relative h-44 w-44 md:h-52 md:w-52 flex-shrink-0 animate-float">
          {renderBossSvg()}
        </div>

        {/* Boss HP & Raid Info */}
        <div className="flex-1 w-full space-y-3">
          <p className="text-xs leading-relaxed text-slate-300">{boss.description}</p>

          <div className="rounded-xl bg-slate-900/90 p-3.5 ring-1 ring-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Swords className="h-4 w-4" /> BOSS HEALTH POINTS
              </span>
              <span className="font-mono text-sm text-white">
                {boss.currentHp} / {boss.maxHp} HP ({hpPercentage}%)
              </span>
            </div>

            {/* Glowing HP Bar */}
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-slate-950 ring-1 ring-rose-900/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(244,63,94,0.7)]"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <ShieldAlert className="h-4 w-4" /> Weakness:
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold uppercase text-amber-300">
                {boss.weakness.replace("_", " ")}
              </span>
            </div>

            {boss.isDefeated ? (
              <button
                onClick={() => openChest(boss.lootChestRarity)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <Trophy className="h-4 w-4" /> CLAIM MYTHIC LOOT CHEST
              </button>
            ) : (
              <button
                onClick={() => strikeBossDirectly(150)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all hover:bg-rose-500 hover:scale-105 active:scale-95"
              >
                <Zap className="h-4 w-4" /> QUICK RAID STRIKE (-150 HP)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
