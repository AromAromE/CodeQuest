"use client";

import { create } from "zustand";
import {
  UserProfile,
  Project,
  Task,
  DailyQuest,
  Boss,
  Pet,
  GardenPlant,
  InventoryItem,
  Achievement,
  FloatingNumber,
  SkillCategory,
  SkillProgress,
  Rarity,
} from "@/types/game";
import {
  getXpRequiredForLevel,
  TASK_REWARDS,
  getComboMultiplier,
  getProjectTier,
  rollLootDrop,
} from "./gameEngine";
import { soundEngine } from "./sound";

// Sample initial mock data for immediate out-of-the-box playability
const INITIAL_USER: UserProfile = {
  id: "user-1",
  username: "NeoCoder",
  title: "Novice Syntax Mage",
  level: 4,
  xp: 320,
  xpToNextLevel: getXpRequiredForLevel(4),
  coins: 450,
  streakDays: 5,
  lastActiveDate: new Date().toISOString(),
  equippedTheme: "cyberpunk",
  equippedBorder: "border-neon-cyan",
  equippedAura: "aura-quantum",
  comboCount: 0,
  comboMultiplier: 1.0,
  comboTimer: 0,
};

const INITIAL_SKILLS: Record<SkillCategory, SkillProgress> = {
  backend: { level: 8, xp: 450, xpToNextLevel: 600 },
  frontend: { level: 6, xp: 280, xpToNextLevel: 450 },
  devops: { level: 4, xp: 120, xpToNextLevel: 300 },
  cloud: { level: 3, xp: 80, xpToNextLevel: 250 },
  database: { level: 5, xp: 210, xpToNextLevel: 380 },
  system_design: { level: 3, xp: 95, xpToNextLevel: 250 },
  ai_ml: { level: 2, xp: 50, xpToNextLevel: 200 },
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "CodeQuest RPG Engine",
    description: "Full-stack gamified coding platform with real-time dopamine triggers.",
    language: "TypeScript / Go",
    framework: "Next.js & Gin",
    level: 4,
    xp: 260,
    xpToNextLevel: 400,
    tierName: "Growing API",
    progress: 45,
    color: "from-cyan-500 to-blue-600",
    icon: "Gamepad2",
    tasks: [
      {
        id: "t-1",
        projectId: "proj-1",
        title: "Implement Web Audio SFX Engine",
        description: "Zero-latency arcade synthesizer for XP & Coin pickups",
        difficulty: "medium",
        xpReward: 75,
        coinReward: 35,
        completed: true,
        tags: ["frontend"],
      },
      {
        id: "t-2",
        projectId: "proj-1",
        title: "Build Developer Evolution Avatar",
        description: "Visual SVG transformations for Lv 1 -> 100+ stages",
        difficulty: "hard",
        xpReward: 200,
        coinReward: 100,
        completed: false,
        tags: ["frontend", "system_design"],
      },
      {
        id: "t-3",
        projectId: "proj-1",
        title: "Create Weekly Boss Raid Endpoint",
        description: "Go Gin handler with real-time damage calculation",
        difficulty: "boss",
        xpReward: 500,
        coinReward: 300,
        completed: false,
        tags: ["backend", "database"],
      },
      {
        id: "t-4",
        projectId: "proj-1",
        title: "Optimize Docker Compose config",
        description: "Unified multi-stage container orchestration",
        difficulty: "easy",
        xpReward: 25,
        coinReward: 10,
        completed: false,
        tags: ["devops", "cloud"],
      },
    ],
  },
  {
    id: "proj-2",
    title: "Distributed Payment Gateway",
    description: "Ultra-low latency idempotent payment processing pipeline.",
    language: "Go",
    framework: "Gin + Redis",
    level: 8,
    xp: 680,
    xpToNextLevel: 800,
    tierName: "Production API",
    progress: 78,
    color: "from-amber-500 to-rose-600",
    icon: "Coins",
    tasks: [
      {
        id: "t-5",
        projectId: "proj-2",
        title: "Add Redis Idempotency Lock",
        description: "Prevent double-spending during network partitions",
        difficulty: "hard",
        xpReward: 200,
        coinReward: 100,
        completed: false,
        tags: ["backend", "database"],
      },
      {
        id: "t-6",
        projectId: "proj-2",
        title: "Setup Prometheus Metrics Exporter",
        description: "Track 99th percentile transaction latencies",
        difficulty: "medium",
        xpReward: 75,
        coinReward: 35,
        completed: false,
        tags: ["devops", "cloud"],
      },
    ],
  },
  {
    id: "proj-3",
    title: "Neural Vision Classifier",
    description: "Edge-deployed image classification model with WebAssembly.",
    language: "Python / Rust",
    framework: "PyTorch & WASM",
    level: 2,
    xp: 90,
    xpToNextLevel: 250,
    tierName: "Baby API",
    progress: 20,
    color: "from-emerald-500 to-teal-600",
    icon: "Brain",
    tasks: [
      {
        id: "t-7",
        projectId: "proj-3",
        title: "Quantize weights to 8-bit integers",
        description: "Reduce model footprint for in-browser inference",
        difficulty: "hard",
        xpReward: 200,
        coinReward: 100,
        completed: false,
        tags: ["ai_ml", "system_design"],
      },
    ],
  },
];

const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: "q-1",
    title: "Code for 30 Minutes",
    description: "Focus on your main repository without distractions",
    xpReward: 150,
    coinReward: 50,
    progress: 30,
    target: 30,
    completed: true,
    type: "minutes",
    claimed: false,
  },
  {
    id: "q-2",
    title: "Complete 3 Tasks",
    description: "Crush tasks across any of your active projects",
    xpReward: 250,
    coinReward: 100,
    progress: 1,
    target: 3,
    completed: false,
    type: "tasks",
    claimed: false,
  },
  {
    id: "q-3",
    title: "Strike the Weekly Raid Boss",
    description: "Inflict at least 200 damage on the Monolith Dragon",
    xpReward: 300,
    coinReward: 120,
    progress: 100,
    target: 200,
    completed: false,
    type: "boss_hit",
    claimed: false,
  },
  {
    id: "q-4",
    title: "Push 2 Git Commits",
    description: "Maintain your active GitHub streak",
    xpReward: 200,
    coinReward: 75,
    progress: 2,
    target: 2,
    completed: true,
    type: "commits",
    claimed: false,
  },
];

const INITIAL_BOSS: Boss = {
  id: "boss-1",
  name: "The Monolith Dragon",
  title: "Ancient Kraken of Legacy Spaghetti Code",
  description: "A terrifying colossal dragon woven from 1,000,000 lines of unrefactored legacy code. Its weakness is clean modular architecture!",
  maxHp: 2500,
  currentHp: 1850,
  avatarSvgType: "dragon",
  weakness: "system_design",
  weeklyDeadline: "3 days 14 hours remaining",
  lootChestRarity: "mythic",
  isDefeated: false,
  attacksEvaded: 0,
};

const INITIAL_PETS: Pet[] = [
  {
    id: "pet-1",
    name: "Sparky the Cyber Fox",
    species: "fox",
    level: 3,
    happiness: 92,
    energy: 85,
    favoriteLanguage: "TypeScript",
    unlocked: true,
    active: true,
  },
  {
    id: "pet-2",
    name: "Draco the Flame Whelp",
    species: "dragon",
    level: 1,
    happiness: 60,
    energy: 70,
    favoriteLanguage: "Rust",
    unlocked: false,
    active: false,
  },
  {
    id: "pet-3",
    name: "Gloop the Byte Slime",
    species: "slime",
    level: 2,
    happiness: 75,
    energy: 90,
    favoriteLanguage: "Go",
    unlocked: true,
    active: false,
  },
  {
    id: "pet-4",
    name: "Unit-01 Robo Drone",
    species: "robot",
    level: 4,
    happiness: 100,
    energy: 100,
    favoriteLanguage: "Python",
    unlocked: true,
    active: false,
  },
];

const INITIAL_GARDEN: GardenPlant[] = [
  {
    id: "plant-1",
    slotIndex: 0,
    stage: 4,
    type: "neon_sakura",
    plantedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastWatered: new Date().toISOString(),
    growthProgress: 100,
  },
  {
    id: "plant-2",
    slotIndex: 1,
    stage: 3,
    type: "cyber_oak",
    plantedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastWatered: new Date().toISOString(),
    growthProgress: 75,
  },
  {
    id: "plant-3",
    slotIndex: 2,
    stage: 2,
    type: "quantum_pine",
    plantedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastWatered: new Date().toISOString(),
    growthProgress: 40,
  },
  {
    id: "plant-4",
    slotIndex: 3,
    stage: 1,
    type: "binary_bonsai",
    plantedAt: new Date().toISOString(),
    lastWatered: new Date().toISOString(),
    growthProgress: 10,
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Neon Cyan Cyber Border",
    description: "Glowing border for your avatar profile.",
    type: "border",
    rarity: "rare",
    icon: "Sparkles",
    equipped: true,
  },
  {
    id: "inv-2",
    name: "Cyberpunk Synth City Theme",
    description: "Dynamic neon background with falling code rain.",
    type: "theme",
    rarity: "epic",
    icon: "Palette",
    equipped: true,
  },
  {
    id: "inv-3",
    name: "Master of Goroutines",
    description: "Exclusive title awarded to backend warriors.",
    type: "title",
    rarity: "legendary",
    icon: "Crown",
    equipped: false,
  },
  {
    id: "inv-4",
    name: "Quantum Matrix Particle Aura",
    description: "Holographic particles circling your evolution stage.",
    type: "aura",
    rarity: "mythic",
    icon: "Flame",
    equipped: true,
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Hello World!",
    description: "Complete your very first coding task.",
    icon: "Terminal",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2 days ago",
    progress: 1,
    maxProgress: 1,
  },
  {
    id: "ach-2",
    title: "Combo Master",
    description: "Reach a 5x Task Combo streak in under 2 minutes.",
    icon: "Zap",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "1 day ago",
    progress: 5,
    maxProgress: 5,
  },
  {
    id: "ach-3",
    title: "Dragon Slayer",
    description: "Deal over 1,000 damage to a weekly Boss.",
    icon: "Swords",
    rarity: "epic",
    unlocked: false,
    progress: 650,
    maxProgress: 1000,
  },
  {
    id: "ach-4",
    title: "Digital Botanist",
    description: "Grow a full 4-tree Cyber Garden.",
    icon: "TreePine",
    rarity: "rare",
    unlocked: false,
    progress: 2,
    maxProgress: 4,
  },
  {
    id: "ach-5",
    title: "Mythic Architect",
    description: "Reach Developer Evolution Tier 5 (Level 100).",
    icon: "Crown",
    rarity: "mythic",
    unlocked: false,
    progress: 4,
    maxProgress: 100,
  },
];

interface GameState {
  user: UserProfile;
  skills: Record<SkillCategory, SkillProgress>;
  projects: Project[];
  dailyQuests: DailyQuest[];
  boss: Boss;
  pets: Pet[];
  garden: GardenPlant[];
  inventory: InventoryItem[];
  achievements: Achievement[];
  floatingNumbers: FloatingNumber[];
  screenShake: boolean;
  levelUpModalOpen: boolean;
  leveledUpTo: number | null;
  chestModalOpen: boolean;
  openedLootItem: InventoryItem | null;
  isMuted: boolean;

  // Actions
  completeTask: (taskId: string, clickCoordinates?: { x: number; y: number }) => void;
  claimQuest: (questId: string) => void;
  openChest: (rarity?: Rarity) => void;
  closeChestModal: () => void;
  closeLevelUpModal: () => void;
  waterGarden: (plantId: string) => void;
  selectPet: (petId: string) => void;
  feedPet: (petId: string) => void;
  addProject: (newProject: Omit<Project, "id" | "level" | "xp" | "xpToNextLevel" | "tierName" | "progress" | "tasks">) => void;
  addTask: (projectId: string, task: Omit<Task, "id" | "projectId" | "completed">) => void;
  toggleSoundMute: () => void;
  resetCombo: () => void;
  removeFloatingNumber: (id: string) => void;
  strikeBossDirectly: (damage: number) => void;
}

let comboTimeout: NodeJS.Timeout | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  user: INITIAL_USER,
  skills: INITIAL_SKILLS,
  projects: INITIAL_PROJECTS,
  dailyQuests: INITIAL_QUESTS,
  boss: INITIAL_BOSS,
  pets: INITIAL_PETS,
  garden: INITIAL_GARDEN,
  inventory: INITIAL_INVENTORY,
  achievements: INITIAL_ACHIEVEMENTS,
  floatingNumbers: [],
  screenShake: false,
  levelUpModalOpen: false,
  leveledUpTo: null,
  chestModalOpen: false,
  openedLootItem: null,
  isMuted: false,

  toggleSoundMute: () => {
    const newMute = soundEngine.toggleMute();
    set({ isMuted: newMute });
  },

  removeFloatingNumber: (id: string) => {
    set((state) => ({
      floatingNumbers: state.floatingNumbers.filter((item) => item.id !== id),
    }));
  },

  resetCombo: () => {
    set((state) => ({
      user: {
        ...state.user,
        comboCount: 0,
        comboMultiplier: 1.0,
        comboTimer: 0,
      },
    }));
  },

  completeTask: (taskId: string, coords?: { x: number; y: number }) => {
    const state = get();
    let targetTask: Task | null = null;
    let targetProject: Project | null = null;

    for (const p of state.projects) {
      const found = p.tasks.find((t) => t.id === taskId);
      if (found) {
        targetTask = found;
        targetProject = p;
        break;
      }
    }

    if (!targetTask || targetTask.completed) return;

    // Trigger audio cues
    soundEngine.playClick();
    soundEngine.playCoin();

    // Calculate rewards with combo multiplier
    const rewards = TASK_REWARDS[targetTask.difficulty];
    const newComboCount = state.user.comboCount + 1;
    const newMultiplier = getComboMultiplier(newComboCount);

    if (newComboCount > 1) {
      soundEngine.playCombo(newComboCount);
    }
    soundEngine.playXpGain(newMultiplier);

    const gainedXp = Math.round(rewards.xp * newMultiplier);
    const gainedCoins = rewards.coins;
    const bossDmg = rewards.bossDamage;

    // Reset or restart combo decay timer (15 seconds combo window)
    if (comboTimeout) clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => {
      get().resetCombo();
    }, 15000);

    // Prepare floating numbers
    const clickX = coords?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 400);
    const clickY = coords?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 400);

    const newFloatingNumbers: FloatingNumber[] = [
      {
        id: `xp-${Date.now()}-${Math.random()}`,
        x: clickX,
        y: clickY - 20,
        text: `+${gainedXp} XP`,
        type: "xp",
      },
      {
        id: `coin-${Date.now()}-${Math.random()}`,
        x: clickX + 40,
        y: clickY + 10,
        text: `+${gainedCoins} Coins`,
        type: "coin",
      },
    ];

    if (newMultiplier > 1) {
      newFloatingNumbers.push({
        id: `combo-${Date.now()}-${Math.random()}`,
        x: clickX - 40,
        y: clickY - 40,
        text: `COMBO x${newMultiplier.toFixed(1)}!`,
        type: "combo",
      });
    }

    // Level up calculation for User
    let currentUserXp = state.user.xp + gainedXp;
    let currentUserLevel = state.user.level;
    let xpNeeded = state.user.xpToNextLevel;
    let hasLeveledUp = false;

    while (currentUserXp >= xpNeeded) {
      currentUserXp -= xpNeeded;
      currentUserLevel += 1;
      xpNeeded = getXpRequiredForLevel(currentUserLevel);
      hasLeveledUp = true;
    }

    if (hasLeveledUp) {
      soundEngine.playLevelUp();
    }

    // Update Project Level & Progress
    const updatedProjects = state.projects.map((p) => {
      if (p.id !== targetProject!.id) return p;
      const updatedTasks = p.tasks.map((t) => (t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t));
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);

      let pXp = p.xp + gainedXp;
      let pLevel = p.level;
      let pXpNeeded = p.xpToNextLevel;

      while (pXp >= pXpNeeded) {
        pXp -= pXpNeeded;
        pLevel += 1;
        pXpNeeded = Math.floor(100 * Math.pow(pLevel, 1.3));
      }

      return {
        ...p,
        tasks: updatedTasks,
        progress,
        xp: pXp,
        level: pLevel,
        xpToNextLevel: pXpNeeded,
        tierName: getProjectTier(pLevel),
      };
    });

    // Update Skills
    const updatedSkills = { ...state.skills };
    targetTask.tags.forEach((tag) => {
      if (updatedSkills[tag]) {
        const skill = updatedSkills[tag];
        let sXp = skill.xp + Math.round(gainedXp * 0.8);
        let sLevel = skill.level;
        let sNeeded = skill.xpToNextLevel;

        while (sXp >= sNeeded) {
          sXp -= sNeeded;
          sLevel += 1;
          sNeeded = Math.floor(80 * Math.pow(sLevel, 1.35));
        }

        updatedSkills[tag] = {
          level: sLevel,
          xp: sXp,
          xpToNextLevel: sNeeded,
        };
      }
    });

    // Damage weekly Boss
    const newBossHp = Math.max(0, state.boss.currentHp - bossDmg);
    soundEngine.playBossHit();

    // Check boss defeat
    const isBossDefeated = newBossHp === 0 && !state.boss.isDefeated;
    if (isBossDefeated) {
      soundEngine.playLevelUp();
    }

    // Garden growth bonus
    const updatedGarden = state.garden.map((plant) => {
      const newProgress = Math.min(100, plant.growthProgress + 15);
      let newStage = plant.stage;
      if (newProgress >= 100 && newStage < 4) {
        newStage = (newStage + 1) as 1 | 2 | 3 | 4;
      }
      return {
        ...plant,
        growthProgress: newProgress,
        stage: newStage,
      };
    });

    // Pet happiness boost
    const updatedPets = state.pets.map((pet) =>
      pet.active ? { ...pet, happiness: Math.min(100, pet.happiness + 5), energy: Math.min(100, pet.energy + 5) } : pet
    );

    // Update Daily Quests progress
    const updatedQuests = state.dailyQuests.map((q) => {
      if (q.type === "tasks" && !q.completed) {
        const newProg = q.progress + 1;
        return { ...q, progress: newProg, completed: newProg >= q.target };
      }
      if (q.type === "boss_hit" && !q.completed) {
        const newProg = q.progress + bossDmg;
        return { ...q, progress: newProg, completed: newProg >= q.target };
      }
      return q;
    });

    set((s) => ({
      user: {
        ...s.user,
        level: currentUserLevel,
        xp: currentUserXp,
        xpToNextLevel: xpNeeded,
        coins: s.user.coins + gainedCoins,
        comboCount: newComboCount,
        comboMultiplier: newMultiplier,
        comboTimer: 100,
      },
      projects: updatedProjects,
      skills: updatedSkills,
      boss: {
        ...s.boss,
        currentHp: newBossHp,
        isDefeated: s.boss.isDefeated || isBossDefeated,
      },
      garden: updatedGarden,
      pets: updatedPets,
      dailyQuests: updatedQuests,
      floatingNumbers: [...s.floatingNumbers, ...newFloatingNumbers],
      screenShake: hasLeveledUp || isBossDefeated || newComboCount >= 3,
      levelUpModalOpen: hasLeveledUp,
      leveledUpTo: hasLeveledUp ? currentUserLevel : s.leveledUpTo,
    }));

    // Auto-clear screen shake after 500ms
    setTimeout(() => {
      set({ screenShake: false });
    }, 500);
  },

  claimQuest: (questId: string) => {
    const state = get();
    const quest = state.dailyQuests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    soundEngine.playCoin();
    soundEngine.playXpGain();

    set((s) => ({
      user: {
        ...s.user,
        xp: s.user.xp + quest.xpReward,
        coins: s.user.coins + quest.coinReward,
      },
      dailyQuests: s.dailyQuests.map((q) => (q.id === questId ? { ...q, claimed: true } : q)),
    }));
  },

  openChest: (rarity: Rarity = "epic") => {
    soundEngine.playChestOpen();
    const droppedRarity = rollLootDrop(rarity === "mythic" ? 50 : 20);

    const LOOT_POOL: InventoryItem[] = [
      {
        id: `loot-${Date.now()}-1`,
        name: "Obsidian Gold Emperor Border",
        description: "Regal border reserved for true 10x engineers.",
        type: "border",
        rarity: "mythic",
        icon: "Crown",
      },
      {
        id: `loot-${Date.now()}-2`,
        name: "Synthwave Sunset Code Rain",
        description: "Vibrant retro neon grid background wallpaper.",
        type: "theme",
        rarity: "epic",
        icon: "Palette",
      },
      {
        id: `loot-${Date.now()}-3`,
        name: "Nebula Dragon Pet Companion",
        description: "A cosmic dragon that breathes clean compiled binaries.",
        type: "pet",
        rarity: "legendary",
        icon: "Sparkles",
      },
      {
        id: `loot-${Date.now()}-4`,
        name: "Zero Downtime Deployer Title",
        description: "Prestigious player title for fearless master pushers.",
        type: "title",
        rarity: "rare",
        icon: "Flame",
      },
    ];

    const chosenItem = LOOT_POOL.find((item) => item.rarity === droppedRarity) || LOOT_POOL[0];

    setTimeout(() => {
      soundEngine.playAchievement();
      set((s) => ({
        chestModalOpen: true,
        openedLootItem: chosenItem,
        inventory: [chosenItem, ...s.inventory],
      }));
    }, 600);
  },

  closeChestModal: () => set({ chestModalOpen: false, openedLootItem: null }),
  closeLevelUpModal: () => set({ levelUpModalOpen: false, leveledUpTo: null }),

  waterGarden: (plantId: string) => {
    soundEngine.playCoin();
    set((s) => ({
      garden: s.garden.map((p) =>
        p.id === plantId
          ? {
              ...p,
              growthProgress: Math.min(100, p.growthProgress + 25),
              stage: p.growthProgress + 25 >= 100 && p.stage < 4 ? ((p.stage + 1) as 1 | 2 | 3 | 4) : p.stage,
              lastWatered: new Date().toISOString(),
            }
          : p
      ),
      user: {
        ...s.user,
        xp: s.user.xp + 15,
      },
    }));
  },

  selectPet: (petId: string) => {
    soundEngine.playClick();
    set((s) => ({
      pets: s.pets.map((p) => ({ ...p, active: p.id === petId })),
    }));
  },

  feedPet: (petId: string) => {
    soundEngine.playCoin();
    set((s) => ({
      pets: s.pets.map((p) =>
        p.id === petId
          ? { ...p, happiness: Math.min(100, p.happiness + 20), energy: Math.min(100, p.energy + 20) }
          : p
      ),
      user: { ...s.user, coins: Math.max(0, s.user.coins - 10) },
    }));
  },

  addProject: (newProject) => {
    soundEngine.playAchievement();
    const project: Project = {
      ...newProject,
      id: `proj-${Date.now()}`,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      tierName: "Baby API",
      progress: 0,
      tasks: [],
    };
    set((s) => ({ projects: [project, ...s.projects] }));
  },

  addTask: (projectId: string, taskData) => {
    soundEngine.playClick();
    const task: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      projectId,
      completed: false,
    };
    set((s) => ({
      projects: s.projects.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)),
    }));
  },

  strikeBossDirectly: (damage: number) => {
    soundEngine.playBossHit();
    set((s) => {
      const newHp = Math.max(0, s.boss.currentHp - damage);
      const isDefeated = newHp === 0 && !s.boss.isDefeated;
      if (isDefeated) soundEngine.playLevelUp();
      return {
        boss: { ...s.boss, currentHp: newHp, isDefeated: s.boss.isDefeated || isDefeated },
        screenShake: true,
      };
    });
    setTimeout(() => set({ screenShake: false }), 400);
  },
}));
