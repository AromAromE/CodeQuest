"use client";

import { useEffect, useState } from "react";
import { getEvolutionStage } from "@/lib/gameEngine";
import { Sparkles, Terminal, Cpu, Zap, Shield, Crown } from "lucide-react";

interface DeveloperEvolutionProps {
  level: number;
  interactive?: boolean;
}

export function DeveloperEvolution({ level, interactive = true }: DeveloperEvolutionProps) {
  const stage = getEvolutionStage(level);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 800);
    return () => clearTimeout(t);
  }, [level]);

  // Stage-specific SVG illustrations
  const renderAvatarGraphic = () => {
    switch (stage.tier) {
      case 1:
        // Tier 1: Beginner Hacker with laptop, desk lamp, and coffee
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <defs>
              <radialGradient id="lampGlow" cx="70%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="120" r="105" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="170" cy="70" r="45" fill="url(#lampGlow)" />
            {/* Desk */}
            <rect x="40" y="160" width="160" height="12" rx="4" fill="#334155" />
            {/* Coffee mug */}
            <rect x="60" y="140" width="16" height="20" rx="3" fill="#0284c7" />
            <path d="M 60 148 C 52 148, 52 156, 60 156" fill="none" stroke="#0284c7" strokeWidth="2" />
            {/* Steam */}
            <path d="M 66 134 Q 69 130 66 126" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Laptop Base & Screen */}
            <polygon points="90,160 150,160 145,152 95,152" fill="#64748b" />
            <rect x="95" y="105" width="50" height="46" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            {/* Glowing Code on screen */}
            <line x1="100" y1="115" x2="125" y2="115" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="122" x2="138" y2="122" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="129" x2="118" y2="129" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="136" x2="130" y2="136" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
            {/* Hacker Silhouette Head & Glasses */}
            <circle cx="120" cy="75" r="18" fill="#1e293b" />
            <rect x="110" y="72" width="8" height="6" rx="1" fill="#38bdf8" />
            <rect x="122" y="72" width="8" height="6" rx="1" fill="#38bdf8" />
            <line x1="118" y1="75" x2="122" y2="75" stroke="#38bdf8" strokeWidth="2" />
          </svg>
        );

      case 2:
        // Tier 2: Apprentice Coder (Dual monitors, mechanical RGB setup, purple cyber aura)
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <defs>
              <linearGradient id="rgbKey" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="105" fill="#090d16" stroke="#a855f7" strokeWidth="3" />
            <circle cx="120" cy="120" r="95" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="8 6" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "30s" }} />
            {/* Dual screens */}
            <rect x="45" y="85" width="65" height="50" rx="4" fill="#030712" stroke="#a855f7" strokeWidth="2" />
            <rect x="130" y="85" width="65" height="50" rx="4" fill="#030712" stroke="#38bdf8" strokeWidth="2" />
            {/* Screen contents */}
            <line x1="52" y1="98" x2="90" y2="98" stroke="#a855f7" strokeWidth="2" />
            <line x1="52" y1="108" x2="100" y2="108" stroke="#ec4899" strokeWidth="2" />
            <line x1="52" y1="118" x2="75" y2="118" stroke="#06b6d4" strokeWidth="2" />
            {/* Vertical terminal screen */}
            <line x1="138" y1="98" x2="185" y2="98" stroke="#22c55e" strokeWidth="2" />
            <line x1="138" y1="108" x2="175" y2="108" stroke="#22c55e" strokeWidth="2" />
            <line x1="138" y1="118" x2="160" y2="118" stroke="#eab308" strokeWidth="2" />
            {/* RGB Keyboard */}
            <rect x="75" y="160" width="90" height="15" rx="3" fill="url(#rgbKey)" />
            {/* Headphones */}
            <path d="M 98 75 A 22 22 0 0 1 142 75" fill="none" stroke="#a855f7" strokeWidth="4" />
            <rect x="94" y="70" width="8" height="14" rx="2" fill="#c084fc" />
            <rect x="138" y="70" width="8" height="14" rx="2" fill="#c084fc" />
          </svg>
        );

      case 3:
        // Tier 3: Senior Engineer (Command center with floating robotic drones)
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <circle cx="120" cy="120" r="105" fill="#050814" stroke="#eab308" strokeWidth="3" />
            <circle cx="120" cy="120" r="112" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="12 8" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "20s" }} />
            {/* Curved Holographic Ultra-Wide Screen */}
            <path d="M 40 100 Q 120 70 200 100 L 195 140 Q 120 115 45 140 Z" fill="#020617" stroke="#eab308" strokeWidth="2" />
            {/* Floating Drones */}
            <g className="animate-bounce" style={{ animationDuration: "3s" }}>
              <circle cx="45" cy="65" r="14" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
              <circle cx="45" cy="65" r="6" fill="#00f0ff" />
              <line x1="30" y1="65" x2="20" y2="60" stroke="#eab308" strokeWidth="2" />
              <line x1="60" y1="65" x2="70" y2="60" stroke="#eab308" strokeWidth="2" />
            </g>
            <g className="animate-bounce" style={{ animationDuration: "2.6s", animationDelay: "0.5s" }}>
              <circle cx="195" cy="65" r="14" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
              <circle cx="195" cy="65" r="6" fill="#00f0ff" />
              <line x1="180" y1="65" x2="170" y2="60" stroke="#eab308" strokeWidth="2" />
              <line x1="210" y1="65" x2="220" y2="60" stroke="#eab308" strokeWidth="2" />
            </g>
            {/* Cyber Visor Character */}
            <circle cx="120" cy="155" r="22" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
            <polygon points="105,150 135,150 130,158 110,158" fill="#eab308" />
          </svg>
        );

      case 4:
        // Tier 4: Tech Wizard (Holographic floating code rune circles & energy rings)
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <circle cx="120" cy="120" r="105" fill="#0b0314" stroke="#f43f5e" strokeWidth="3" />
            {/* Magic Code Circles */}
            <circle cx="120" cy="120" r="85" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="20 10 5 10" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "14s" }} />
            <circle cx="120" cy="120" r="65" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="10 5" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "10s", animationDirection: "reverse" }} />
            {/* Floating Code Crystals */}
            <polygon points="120,40 130,60 120,80 110,60" fill="#f43f5e" opacity="0.85" />
            <polygon points="40,120 60,130 80,120 60,110" fill="#00f0ff" opacity="0.85" />
            <polygon points="200,120 180,130 160,120 180,110" fill="#a855f7" opacity="0.85" />
            {/* Wizard Orb in center */}
            <circle cx="120" cy="120" r="28" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="120" cy="120" r="16" fill="#f43f5e" className="animate-ping" style={{ animationDuration: "2s" }} />
          </svg>
        );

      case 5:
      default:
        // Tier 5: Legendary Digital Architect (Cosmic Cyber Deity)
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full">
            <defs>
              <linearGradient id="cosmicGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="105" fill="#02140e" stroke="url(#cosmicGrad)" strokeWidth="4" />
            <circle cx="120" cy="120" r="95" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="15 10 5 10" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "12s" }} />
            <circle cx="120" cy="120" r="115" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 8" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "8s", animationDirection: "reverse" }} />
            {/* Golden Mythic Crown */}
            <polygon points="90,45 105,65 120,40 135,65 150,45 145,75 95,75" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
            {/* Quantum Core */}
            <circle cx="120" cy="120" r="32" fill="#022c22" stroke="#10b981" strokeWidth="3" />
            <polygon points="120,100 138,120 120,140 102,120" fill="url(#cosmicGrad)" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`glass-panel relative flex flex-col items-center overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
        pulse ? "scale-105 ring-4 ring-cyan-400" : ""
      }`}
      style={{
        boxShadow: `0 0 40px ${stage.auraColor}`,
        borderColor: stage.auraColor,
      }}
    >
      {/* Dynamic Evolution Header Badge */}
      <div className="mb-4 flex w-full items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-black tracking-wider text-cyan-300">
            TIER {stage.tier}
          </span>
          <span className="text-xs font-semibold uppercase text-slate-400">Developer Evolution</span>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-amber-400 shadow-inner">
          {stage.badge}
        </span>
      </div>

      {/* Avatar Display Frame */}
      <div className="relative my-2 h-44 w-44 md:h-52 md:w-52">
        {/* Glow halo */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: stage.auraColor }}
        />
        <div className="relative z-10 h-full w-full drop-shadow-2xl">{renderAvatarGraphic()}</div>
      </div>

      {/* Evolution Info */}
      <div className="mt-3 text-center">
        <h3 className="text-xl font-black tracking-wide text-white drop-shadow-md">
          {stage.name}
        </h3>
        <p className="mt-1 text-xs font-medium italic text-cyan-300">{stage.tagline}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2 max-w-xs">{stage.description}</p>
      </div>

      {/* Evolution Milestone Progress Bar */}
      <div className="mt-4 w-full">
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>Current: Lv {level}</span>
          <span>Next Tier: Lv {stage.maxLevel + 1}</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 transition-all duration-700"
            style={{
              width: `${Math.min(
                100,
                Math.max(5, ((level - stage.minLevel + 1) / (stage.maxLevel - stage.minLevel + 1)) * 100)
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
