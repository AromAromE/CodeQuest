"use client";

import { useGameStore } from "@/lib/store";
import { TopNav } from "@/components/layout/TopNav";
import { DeveloperEvolution } from "@/components/avatar/DeveloperEvolution";
import { PetCompanion } from "@/components/avatar/PetCompanion";
import { CodingGarden } from "@/components/garden/CodingGarden";
import { BossArena } from "@/components/boss/BossArena";
import { ProjectTaskHub } from "@/components/quests/ProjectTaskHub";
import { DailyQuestsList } from "@/components/quests/DailyQuestsList";
import { SkillTreeStats } from "@/components/skills/SkillTreeStats";
import { FloatingFX } from "@/components/game-ui/FloatingFX";
import { CyberParticlesCanvas } from "@/components/game-ui/CyberParticlesCanvas";
import { LootChestModal } from "@/components/loot/LootChestModal";
import { LevelUpModal } from "@/components/game-ui/LevelUpModal";
import { Activity, GitBranch, Sparkles, Terminal, Award } from "lucide-react";

export default function GameDashboard() {
  const user = useGameStore((state) => state.user);
  const screenShake = useGameStore((state) => state.screenShake);

  return (
    <div className={`min-h-screen bg-[#070913] text-slate-100 ${screenShake ? "animate-screen-shake" : ""}`}>
      {/* Background Particle Engine */}
      <CyberParticlesCanvas />
      <FloatingFX />
      <LootChestModal />
      <LevelUpModal />

      {/* Top Navigation */}
      <TopNav />

      {/* Main Game Arena Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Welcome & Motivational Banner */}
        <div className="glass-panel flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl p-5 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  Welcome back, <span className="text-cyan-400">{user.username}</span>!
                </h2>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  {user.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every line of code you write today forges your path to <span className="font-bold text-cyan-300">Mythic Architect</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3.5 py-2 ring-1 ring-slate-800 text-xs font-bold text-slate-300">
              <GitBranch className="h-4 w-4 text-slate-400" />
              <span>GitHub XP Hook Active</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* Top Grid: Developer Evolution Avatar & Companion + Boss Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Developer Evolution & Pets */}
          <div className="lg:col-span-4 space-y-6">
            <DeveloperEvolution level={user.level} />
            <PetCompanion />
          </div>

          {/* Right Column: Weekly Boss & Projects Hub */}
          <div className="lg:col-span-8 space-y-6">
            <BossArena />
            <ProjectTaskHub />
          </div>
        </div>

        {/* Bottom Grid: Daily Quests, Skill Tree & Coding Garden */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <DailyQuestsList />
            <CodingGarden />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <SkillTreeStats />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          CodeQuest RPG • Built to maximize dopamine & daily coding mastery 🎮
        </p>
      </footer>
    </div>
  );
}
