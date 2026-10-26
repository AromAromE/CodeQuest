"use client";

import { create } from "zustand";
import { Session, Note, FloatingNumber } from "@/types/game";
import { api } from "./api";
import { soundEngine } from "./sound";

const FALLBACK_SESSION: Session = {
  user: {
    name: "Learner",
    level: 1,
    xp: 0,
    xp_to_next_level: 300,
    streak_days: 1,
    combo_multiplier: 1.0,
  },
  today_topic: "Loading session...",
  quests: [],
};

interface GameState {
  session: Session;
  notes: Note[];
  loading: boolean;
  completingQuestId: string | null;
  error: string | null;
  floatingNumbers: FloatingNumber[];
  levelUpModalOpen: boolean;
  leveledUpTo: number | null;
  isMuted: boolean;

  fetchAll: () => Promise<void>;
  completeQuest: (id: string, coords?: { x: number; y: number }) => Promise<void>;
  removeFloatingNumber: (id: string) => void;
  closeLevelUpModal: () => void;
  toggleSoundMute: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  session: FALLBACK_SESSION,
  notes: [],
  loading: true,
  completingQuestId: null,
  error: null,
  floatingNumbers: [],
  levelUpModalOpen: false,
  leveledUpTo: null,
  isMuted: false,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [session, notes] = await Promise.all([api.getSession(), api.getNotes()]);
      set({ session, notes: notes || [], loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to connect to backend",
      });
    }
  },

  completeQuest: async (id: string, coords?: { x: number; y: number }) => {
    set({ completingQuestId: id, error: null });
    try {
      const res = await api.completeQuest(id);
      const multiplier = res.session.user.combo_multiplier || 1;
      soundEngine.playTaskComplete(multiplier);

      const x = coords?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 400);
      const y = coords?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 300);

      const xpFloat: FloatingNumber = {
        id: `xp-${Date.now()}-${Math.random()}`,
        x,
        y: y - 16,
        text: `+${res.xp_gained} XP`,
        type: "xp",
      };

      if (res.leveled_up) {
        soundEngine.playLevelUp();
      }

      set((state) => ({
        session: res.session,
        completingQuestId: null,
        floatingNumbers: [...state.floatingNumbers, xpFloat],
        levelUpModalOpen: res.leveled_up ? true : state.levelUpModalOpen,
        leveledUpTo: res.leveled_up ? res.session.user.level : state.leveledUpTo,
      }));
    } catch (err) {
      set({
        completingQuestId: null,
        error: err instanceof Error ? err.message : "Failed to complete quest",
      });
    }
  },

  removeFloatingNumber: (id: string) =>
    set((state) => ({
      floatingNumbers: state.floatingNumbers.filter((item) => item.id !== id),
    })),

  closeLevelUpModal: () => set({ levelUpModalOpen: false, leveledUpTo: null }),

  toggleSoundMute: () => {
    const muted = soundEngine.toggleMute();
    set({ isMuted: muted });
  },
}));
