import { Difficulty, Rarity, SkillCategory } from "@/types/game";

// Formula for calculating total XP required for a given player level
export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.45));
}

// XP rewards based on difficulty
export const TASK_REWARDS: Record<Difficulty, { xp: number; coins: number; bossDamage: number }> = {
  easy: { xp: 25, coins: 10, bossDamage: 30 },
  medium: { xp: 75, coins: 35, bossDamage: 90 },
  hard: { xp: 200, coins: 100, bossDamage: 250 },
  boss: { xp: 500, coins: 300, bossDamage: 750 },
};

// Developer Evolution stage metadata based on level
export interface EvolutionStage {
  tier: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  tagline: string;
  description: string;
  auraColor: string;
  badge: string;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    tier: 1,
    name: "Beginner Hacker",
    minLevel: 1,
    maxLevel: 9,
    tagline: "Fueling syntax with warm coffee and dreams",
    description: "Equipped with a trusty laptop, cozy desk lamp, and a thirst for foundational algorithms.",
    auraColor: "rgba(56, 189, 248, 0.4)", // Sky blue
    badge: "🌱 LVL 1+",
  },
  {
    tier: 2,
    name: "Apprentice Coder",
    minLevel: 10,
    maxLevel: 24,
    tagline: "Dual monitors and glowing mechanical switches",
    description: "Constructing scalable APIs and refactoring messy spaghetti into elegant modules.",
    auraColor: "rgba(168, 85, 247, 0.5)", // Purple neon
    badge: "⚡ LVL 10+",
  },
  {
    tier: 3,
    name: "Senior Engineer",
    minLevel: 25,
    maxLevel: 49,
    tagline: "Command center orchestration with robotic companion drones",
    description: "Designing distributed architectures, crushing production bugs, and mentoring junior guilds.",
    auraColor: "rgba(234, 179, 8, 0.6)", // Radiant Gold
    badge: "🛡️ LVL 25+",
  },
  {
    tier: 4,
    name: "Tech Wizard",
    minLevel: 50,
    maxLevel: 99,
    tagline: "Manipulating floating holographic syntax & matrix shields",
    description: "Transcending physical keyboards to channel pure logic directly into cloud constellations.",
    auraColor: "rgba(244, 63, 94, 0.7)", // Crimson Rose
    badge: "🔮 LVL 50+",
  },
  {
    tier: 5,
    name: "Legendary Digital Architect",
    minLevel: 100,
    maxLevel: 999,
    tagline: "Commanding digital universes and planetary nexus servers",
    description: "A cosmic architect whose commits reshape reality itself across multithreaded dimensions.",
    auraColor: "rgba(16, 185, 129, 0.9)", // Mythic Emerald & Cyan
    badge: "👑 LVL 100+",
  },
];

export function getEvolutionStage(level: number): EvolutionStage {
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (level >= EVOLUTION_STAGES[i].minLevel) {
      return EVOLUTION_STAGES[i];
    }
  }
  return EVOLUTION_STAGES[0];
}

// Project evolution tiers based on project level
export function getProjectTier(level: number): string {
  if (level >= 20) return "Legendary Service";
  if (level >= 12) return "Production API";
  if (level >= 6) return "Growing API";
  return "Baby API";
}

// Loot drop calculation
export function rollLootDrop(rarityBoost: number = 0): Rarity {
  const roll = Math.random() * 100 + rarityBoost;
  if (roll > 98) return "mythic";
  if (roll > 90) return "legendary";
  if (roll > 75) return "epic";
  if (roll > 45) return "rare";
  return "common";
}

// Combo multiplier calculation
export function getComboMultiplier(comboCount: number): number {
  if (comboCount <= 1) return 1.0;
  if (comboCount <= 3) return 1.25;
  if (comboCount <= 5) return 1.5;
  if (comboCount <= 8) return 2.0;
  if (comboCount <= 12) return 2.5;
  return 3.0; // Max multiplier
}
