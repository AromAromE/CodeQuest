export interface User {
  name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak_days: number;
  combo_multiplier: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  completed: boolean;
  completed_at: string | null;
}

export interface Session {
  user: User;
  today_topic: string;
  quests: Quest[];
}

export interface Note {
  id: string;
  title: string;
  type: "pinned" | "discovery";
  tags: string[];
  summary: string;
  content: string;
  created_at: string;
}

export interface CompleteQuestResponse {
  message: string;
  xp_gained: number;
  leveled_up: boolean;
  session: Session;
}

export interface FloatingNumber {
  id: string;
  x: number;
  y: number;
  text: string;
  type: "xp" | "coin" | "crit" | "combo" | "damage";
}
