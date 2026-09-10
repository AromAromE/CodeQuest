"use client";

import { useGameStore } from "@/lib/store";
import { Pet } from "@/types/game";
import { Heart, Zap, Sparkles, Utensils } from "lucide-react";

export function PetCompanion() {
  const pets = useGameStore((state) => state.pets);
  const activePet = pets.find((p) => p.active) || pets[0];
  const selectPet = useGameStore((state) => state.selectPet);
  const feedPet = useGameStore((state) => state.feedPet);
  const userCoins = useGameStore((state) => state.user.coins);

  if (!activePet) return null;

  const renderPetSvg = (species: Pet["species"]) => {
    switch (species) {
      case "fox":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Cyber Fox Ears & Head */}
            <polygon points="20,40 35,10 45,35" fill="#f97316" stroke="#fdba74" strokeWidth="2" />
            <polygon points="80,40 65,10 55,35" fill="#f97316" stroke="#fdba74" strokeWidth="2" />
            <ellipse cx="50" cy="55" rx="30" ry="25" fill="#ea580c" />
            {/* White Muzzle */}
            <ellipse cx="50" cy="62" rx="18" ry="12" fill="#fff7ed" />
            <polygon points="46,60 54,60 50,65" fill="#1e293b" />
            {/* Glowing Cyber Eyes */}
            <circle cx="38" cy="50" r="4" fill="#00f0ff" className="animate-pulse" />
            <circle cx="62" cy="50" r="4" fill="#00f0ff" className="animate-pulse" />
          </svg>
        );
      case "dragon":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Flame Horns */}
            <polygon points="30,35 25,12 40,28" fill="#e11d48" />
            <polygon points="70,35 75,12 60,28" fill="#e11d48" />
            <ellipse cx="50" cy="52" rx="28" ry="22" fill="#be123c" />
            <circle cx="38" cy="48" r="5" fill="#fef08a" />
            <circle cx="62" cy="48" r="5" fill="#fef08a" />
            {/* Smoke puffs */}
            <circle cx="50" cy="66" r="3" fill="#fb7185" />
          </svg>
        );
      case "slime":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Bouncing Slime */}
            <path d="M 20 65 C 20 35, 80 35, 80 65 C 80 82, 20 82, 20 65 Z" fill="#10b981" />
            <ellipse cx="50" cy="45" rx="24" ry="10" fill="#34d399" />
            <circle cx="40" cy="55" r="4" fill="#022c22" />
            <circle cx="60" cy="55" r="4" fill="#022c22" />
            <circle cx="42" cy="53" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="53" r="1.5" fill="#ffffff" />
          </svg>
        );
      case "robot":
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="30" width="50" height="42" rx="8" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
            {/* Antenna */}
            <line x1="50" y1="30" x2="50" y2="15" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="15" r="4" fill="#00f0ff" className="animate-ping" style={{ animationDuration: "2s" }} />
            {/* Digital Visor */}
            <rect x="33" y="42" width="34" height="14" rx="3" fill="#020617" />
            <line x1="38" y1="49" x2="62" y2="49" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className="glass-panel relative rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Virtual Pet Companion</h4>
        </div>
        <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-bold text-cyan-400 ring-1 ring-cyan-700/50">
          Lv {activePet.level}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        {/* Animated Pet Sprite */}
        <div className="relative h-20 w-20 flex-shrink-0 animate-bounce" style={{ animationDuration: "2.4s" }}>
          {renderPetSvg(activePet.species)}
        </div>

        {/* Pet Stats */}
        <div className="flex-1 space-y-2">
          <div>
            <h5 className="font-bold text-white text-base">{activePet.name}</h5>
            <p className="text-xs text-slate-400">Fav Stack: <span className="font-semibold text-cyan-300">{activePet.favoriteLanguage}</span></p>
          </div>

          {/* Happiness & Energy Bars */}
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-rose-400">
                <Heart className="h-3 w-3 fill-rose-500" /> Happiness
              </span>
              <span className="font-bold text-slate-200">{activePet.happiness}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                style={{ width: `${activePet.happiness}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-0.5">
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Zap className="h-3 w-3 fill-amber-500" /> Energy
              </span>
              <span className="font-bold text-slate-200">{activePet.energy}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${activePet.energy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action & Pet Switcher */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex gap-1.5">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => selectPet(pet.id)}
              disabled={!pet.unlocked}
              className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                pet.active
                  ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-300"
                  : pet.unlocked
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-900 text-slate-600 opacity-40 cursor-not-allowed"
              }`}
              title={pet.name}
            >
              {pet.species === "fox" && "🦊"}
              {pet.species === "dragon" && "🐲"}
              {pet.species === "slime" && "🟢"}
              {pet.species === "robot" && "🤖"}
            </button>
          ))}
        </div>

        <button
          onClick={() => feedPet(activePet.id)}
          disabled={userCoins < 10}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-xs font-black text-slate-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Utensils className="h-3.5 w-3.5" />
          Feed (10 🪙)
        </button>
      </div>
    </div>
  );
}
