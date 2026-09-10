"use client";

import { useGameStore } from "@/lib/store";
import { SkillCategory } from "@/types/game";
import { Server, Layout, Container, Cloud, Database, Network, Cpu } from "lucide-react";

export function SkillTreeStats() {
  const skills = useGameStore((state) => state.skills);

  const skillMeta: Record<
    SkillCategory,
    { label: string; icon: React.ReactNode; color: string; barGrad: string }
  > = {
    backend: {
      label: "Backend Mastery",
      icon: <Server className="h-4 w-4" />,
      color: "text-blue-400",
      barGrad: "from-blue-500 to-cyan-400",
    },
    frontend: {
      label: "Frontend & UI/UX",
      icon: <Layout className="h-4 w-4" />,
      color: "text-pink-400",
      barGrad: "from-pink-500 to-rose-400",
    },
    devops: {
      label: "Docker & CI/CD",
      icon: <Container className="h-4 w-4" />,
      color: "text-cyan-400",
      barGrad: "from-cyan-500 to-teal-400",
    },
    cloud: {
      label: "Cloud & AWS/GCP",
      icon: <Cloud className="h-4 w-4" />,
      color: "text-amber-400",
      barGrad: "from-amber-500 to-orange-400",
    },
    database: {
      label: "Database & Mongo",
      icon: <Database className="h-4 w-4" />,
      color: "text-emerald-400",
      barGrad: "from-emerald-500 to-green-400",
    },
    system_design: {
      label: "System Architecture",
      icon: <Network className="h-4 w-4" />,
      color: "text-purple-400",
      barGrad: "from-purple-500 to-indigo-400",
    },
    ai_ml: {
      label: "AI & Neural Nets",
      icon: <Cpu className="h-4 w-4" />,
      color: "text-violet-400",
      barGrad: "from-violet-500 to-fuchsia-400",
    },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">RPG Skill Tree Stats</h3>
            <p className="text-xs text-slate-400">Gain specialized XP by coding matching stacks</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {(Object.keys(skills) as SkillCategory[]).map((category) => {
          const progress = skills[category];
          const meta = skillMeta[category];
          const percent = Math.round((progress.xp / progress.xpToNextLevel) * 100);

          return (
            <div
              key={category}
              className="rounded-xl bg-slate-900/80 p-3.5 ring-1 ring-slate-800 transition hover:bg-slate-900 hover:ring-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-slate-800 ${meta.color}`}>{meta.icon}</div>
                  <span className="text-xs font-bold text-slate-200">{meta.label}</span>
                </div>
                <span className="rounded-full bg-slate-950 px-2 py-0.5 font-mono text-xs font-bold text-amber-400">
                  Lv {progress.level}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{progress.xp} XP</span>
                  <span>{progress.xpToNextLevel} XP</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-950 ring-1 ring-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.barGrad} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
