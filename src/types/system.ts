export type TaskType = 'physical' | 'learning' | 'discipline' | 'skill';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  duration: number; // in minutes
  xpValue: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  status: TaskStatus;
  completedAt?: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  rank: string;
  totalTasksCompleted: number;
  totalXpEarned: number;
  failCount: number;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  timeLimit: number; // in minutes
  timeRemaining?: number;
}

export const RANKS = [
  { level: 1, name: 'WEAK', minXp: 0 },
  { level: 5, name: 'TRAINEE', minXp: 500 },
  { level: 10, name: 'FIGHTER', minXp: 1500 },
  { level: 20, name: 'HUNTER', minXp: 4000 },
  { level: 35, name: 'WARRIOR', minXp: 8000 },
  { level: 50, name: 'SHADOW', minXp: 15000 },
  { level: 75, name: 'MONARCH', minXp: 30000 },
];

export const SYSTEM_MESSAGES = [
  "The system is watching.",
  "Weakness is not tolerated.",
  "Rise or fall. Choose.",
  "No excuses. Execute.",
  "Your potential awaits.",
  "Discipline equals freedom.",
  "The grind never stops.",
  "Prove your worth.",
];
