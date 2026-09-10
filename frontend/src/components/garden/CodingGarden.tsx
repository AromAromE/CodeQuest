"use client";

import { useGameStore } from "@/lib/store";
import { TreePine, Droplets, Sparkles } from "lucide-react";

export function CodingGarden() {
  const garden = useGameStore((state) => state.garden);
  const waterGarden = useGameStore((state) => state.waterGarden);

  const renderTreeSvg = (type: string, stage: 1 | 2 | 3 | 4) => {
    switch (stage) {
      case 1:
        // Sprout
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            <ellipse cx="40" cy="65" rx="20" ry="6" fill="#1e293b" />
            <path d="M 40 65 Q 38 45 40 38" stroke="#10b981" strokeWidth="3" fill="none" />
            <ellipse cx="34" cy="38" rx="7" ry="4" fill="#34d399" transform="rotate(-30 34 38)" />
            <ellipse cx="46" cy="38" rx="7" ry="4" fill="#34d399" transform="rotate(30 46 38)" />
          </svg>
        );
      case 2:
        // Sapling
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            <ellipse cx="40" cy="68" rx="22" ry="6" fill="#1e293b" />
            <path d="M 40 68 L 40 30" stroke="#059669" strokeWidth="4" />
            <circle cx="40" cy="30" r="14" fill="#10b981" />
            <circle cx="32" cy="24" r="8" fill="#34d399" />
            <circle cx="48" cy="24" r="8" fill="#34d399" />
          </svg>
        );
      case 3:
        // Mature Neon Tree
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            <ellipse cx="40" cy="70" rx="25" ry="7" fill="#0f172a" />
            <path d="M 40 70 L 40 35" stroke="#334155" strokeWidth="5" />
            {/* Glowing Foliage */}
            <circle cx="40" cy="32" r="22" fill="#00f0ff" opacity="0.85" className="animate-pulse" />
            <circle cx="28" cy="24" r="14" fill="#38bdf8" />
            <circle cx="52" cy="24" r="14" fill="#0284c7" />
            <circle cx="40" cy="16" r="12" fill="#bae6fd" />
          </svg>
        );
      case 4:
      default:
        // Mythical Cyber Sakura
        return (
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            <ellipse cx="40" cy="70" rx="28" ry="8" fill="#0f172a" />
            <path d="M 40 70 Q 35 48 40 30" stroke="#475569" strokeWidth="6" />
            {/* Glowing Sakura Rings */}
            <circle cx="40" cy="26" r="24" fill="#ec4899" opacity="0.9" filter="drop-shadow(0 0 8px #f43f5e)" />
            <circle cx="26" cy="18" r="15" fill="#f43f5e" />
            <circle cx="54" cy="18" r="15" fill="#f43f5e" />
            <circle cx="40" cy="10" r="14" fill="#fbcfe8" />
            {/* Falling Blossom Particles */}
            <circle cx="22" cy="45" r="2" fill="#fbcfe8" className="animate-ping" style={{ animationDuration: "3s" }} />
            <circle cx="58" cy="48" r="2" fill="#fbcfe8" className="animate-ping" style={{ animationDuration: "2.5s" }} />
          </svg>
        );
    }
  };

  return (
    <div className="glass-panel relative rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <TreePine className="h-5 w-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Coding Garden</h4>
            <p className="text-[11px] text-slate-400">Tasks blossom into living cyber flora</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-700/50">
          <Sparkles className="h-3 w-3" /> Growth Nexus
        </span>
      </div>

      {/* Grid of Garden Plants */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {garden.map((plant, index) => (
          <div
            key={plant.id}
            className="group relative flex flex-col items-center justify-between rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800 transition-all hover:ring-emerald-500/50 hover:bg-slate-900"
          >
            <span className="text-[10px] font-bold text-slate-500">Plot #{index + 1}</span>

            {/* Tree Graphic */}
            <div className="my-2 transition-transform duration-300 group-hover:scale-110">
              {renderTreeSvg(plant.type, plant.stage)}
            </div>

            {/* Stage Tag */}
            <span className="text-[11px] font-semibold text-emerald-300">
              {plant.stage === 1 && "Sprout"}
              {plant.stage === 2 && "Sapling"}
              {plant.stage === 3 && "Cyber Tree"}
              {plant.stage === 4 && "Mythic Flora"}
            </span>

            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${plant.growthProgress}%` }}
              />
            </div>

            {/* Water Button */}
            <button
              onClick={() => waterGarden(plant.id)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-emerald-500/20 py-1 text-[11px] font-bold text-emerald-400 transition-all hover:bg-emerald-500 hover:text-slate-950"
            >
              <Droplets className="h-3 w-3" /> Water (+15 XP)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
