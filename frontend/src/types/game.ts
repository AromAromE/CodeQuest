export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type Difficulty = "easy" | "medium" | "hard" | "boss";

export type SkillCategory =
  | "backend"
  | "frontend"
  | "devops"
  | "cloud"
  | "database"
  | "system_design"
  | "ai_ml";

export interface SkillProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  completedAt?: string;
  tags: SkillCategory[];
  isSubmitting?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  framework: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  tierName: string; // e.g., "Baby API", "Growing API", "Production API", "Legendary Service"
  progress: number; // 0 to 100
  tasks: Task[];
  color: string;
  icon: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  completed: boolean;
  type: "commits" | "minutes" | "tasks" | "boss_hit" | "learn";
  claimed: boolean;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  description: string;
  maxHp: number;
  currentHp: number;
  avatarSvgType: "dragon" | "kraken" | "cyber_golem" | "monolith";
  weakness: SkillCategory;
  weeklyDeadline: string;
  lootChestRarity: Rarity;
  isDefeated: boolean;
  attacksEvaded: number;
}

export interface Pet {
  id: string;
  name: string;
  species: "dragon" | "fox" | "slime" | "robot" | "cat";
  level: number;
  happiness: number; // 0 - 100
  energy: number; // 0 - 100
  favoriteLanguage: string;
  unlocked: boolean;
  active: boolean;
}

export interface GardenPlant {
  id: string;
  slotIndex: number;
  stage: 1 | 2 | 3 | 4; // Sprout, Sapling, Tree, Mythical Cyber Tree
  type: "neon_sakura" | "cyber_oak" | "quantum_pine" | "binary_bonsai" | "crystal_fern";
  plantedAt: string;
  lastWatered: string;
  growthProgress: number; // 0 - 100
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: "border" | "theme" | "pet" | "title" | "badge" | "aura";
  rarity: Rarity;
  icon: string;
  unlockedAt?: string;
  equipped?: boolean;
  value?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface FloatingNumber {
  id: string;
  x: number;
  y: number;
  text: string;
  type: "xp" | "coin" | "crit" | "combo" | "damage";
}

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  equippedBorder?: string;
  equippedTheme: string;
  equippedAura?: string;
  comboCount: number;
  comboMultiplier: number;
  comboTimer: number; // Percentage 0-100 remaining
}
