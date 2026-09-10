"use client";

import { useGameStore } from "@/lib/store";
import { CheckCircle2, Gift, Sparkles, Trophy } from "lucide-react";

export function DailyQuestsList() {
  const dailyQuests = useGameStore((state) => state.dailyQuests);
  const claimQuest = useGameStore((state) => state.claimQuest);

  const completedCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Daily Quests</h3>
            <p className="text-xs text-slate-400">Refreshes every 24 hours</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-slate-700">
          {completedCount}/{dailyQuests.length} Completed
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {dailyQuests.map((quest) => (
          <div
            key={quest.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-4 transition-all ${
              quest.claimed
                ? "bg-slate-950/40 opacity-50"
                : quest.completed
                ? "bg-emerald-950/30 ring-1 ring-emerald-500/50"
                : "bg-slate-900/60 ring-1 ring-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs ${
                  quest.completed ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                {quest.completed ? <CheckCircle2 className="h-5 w-5" /> : "!"}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{quest.title}</h4>
                <p className="text-[11px] text-slate-400">{quest.description}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                  <span>Progress: {quest.progress}/{quest.target}</span>
                  <span>•</span>
                  <span>+{quest.xpReward} XP</span>
                  <span>•</span>
                  <span>+{quest.coinReward} Coins</span>
                </div>
              </div>
            </div>

            <div>
              {quest.claimed ? (
                <span className="text-xs font-bold text-slate-500">Claimed</span>
              ) : quest.completed ? (
                <button
                  onClick={() => claimQuest(quest.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1.5 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition hover:scale-105 active:scale-95"
                >
                  <Gift className="h-3.5 w-3.5" /> Claim Reward
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-slate-500">In Progress</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
