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
  isCustom?: boolean;
}

export interface TaskTemplate {
  id: string;
  name: string;
  type: TaskType;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  xpValue: number;
  isDefault?: boolean;
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
  consecutiveFailures: number;
  difficultyMultiplier: number;
  longestStreak: number;
}

export interface DailyLog {
  date: string;
  xpEarned: number;
  tasksCompleted: number;
  tasksFailed: number;
  streakMaintained: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'tasks' | 'streak' | 'level' | 'xp' | 'failures_overcome';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
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

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Task milestones
  { id: 'tasks_10', name: 'FIRST STEPS', description: 'Complete 10 tasks', icon: 'footprints', requirement: { type: 'tasks', value: 10 }, unlocked: false, rarity: 'common' },
  { id: 'tasks_50', name: 'CONSISTENT', description: 'Complete 50 tasks', icon: 'target', requirement: { type: 'tasks', value: 50 }, unlocked: false, rarity: 'common' },
  { id: 'tasks_100', name: 'CENTURION', description: 'Complete 100 tasks', icon: 'award', requirement: { type: 'tasks', value: 100 }, unlocked: false, rarity: 'rare' },
  { id: 'tasks_500', name: 'UNSTOPPABLE', description: 'Complete 500 tasks', icon: 'trophy', requirement: { type: 'tasks', value: 500 }, unlocked: false, rarity: 'epic' },
  { id: 'tasks_1000', name: 'LEGEND', description: 'Complete 1000 tasks', icon: 'crown', requirement: { type: 'tasks', value: 1000 }, unlocked: false, rarity: 'legendary' },
  
  // Streak milestones
  { id: 'streak_7', name: 'WEEK WARRIOR', description: '7-day streak', icon: 'flame', requirement: { type: 'streak', value: 7 }, unlocked: false, rarity: 'common' },
  { id: 'streak_14', name: 'FORTNIGHT FIGHTER', description: '14-day streak', icon: 'flame', requirement: { type: 'streak', value: 14 }, unlocked: false, rarity: 'rare' },
  { id: 'streak_30', name: 'MONTHLY MASTER', description: '30-day streak', icon: 'calendar', requirement: { type: 'streak', value: 30 }, unlocked: false, rarity: 'epic' },
  { id: 'streak_100', name: 'IRON WILL', description: '100-day streak', icon: 'shield', requirement: { type: 'streak', value: 100 }, unlocked: false, rarity: 'legendary' },
  
  // Level milestones
  { id: 'level_10', name: 'RISING', description: 'Reach level 10', icon: 'trending-up', requirement: { type: 'level', value: 10 }, unlocked: false, rarity: 'common' },
  { id: 'level_25', name: 'ESTABLISHED', description: 'Reach level 25', icon: 'star', requirement: { type: 'level', value: 25 }, unlocked: false, rarity: 'rare' },
  { id: 'level_50', name: 'ELITE', description: 'Reach level 50', icon: 'zap', requirement: { type: 'level', value: 50 }, unlocked: false, rarity: 'epic' },
  { id: 'level_100', name: 'TRANSCENDED', description: 'Reach level 100', icon: 'infinity', requirement: { type: 'level', value: 100 }, unlocked: false, rarity: 'legendary' },
  
  // XP milestones
  { id: 'xp_1000', name: 'BEGINNER', description: 'Earn 1,000 XP', icon: 'zap', requirement: { type: 'xp', value: 1000 }, unlocked: false, rarity: 'common' },
  { id: 'xp_10000', name: 'EXPERIENCED', description: 'Earn 10,000 XP', icon: 'bolt', requirement: { type: 'xp', value: 10000 }, unlocked: false, rarity: 'rare' },
  { id: 'xp_50000', name: 'VETERAN', description: 'Earn 50,000 XP', icon: 'sparkles', requirement: { type: 'xp', value: 50000 }, unlocked: false, rarity: 'epic' },
  
  // Special
  { id: 'comeback', name: 'COMEBACK', description: 'Recover from 5 consecutive failures', icon: 'rotate-ccw', requirement: { type: 'failures_overcome', value: 5 }, unlocked: false, rarity: 'rare' },
];

export const DEFAULT_TASK_TEMPLATES: TaskTemplate[] = [
  { id: 't1', name: 'MORNING RUN', type: 'physical', duration: 30, xpValue: 50, difficulty: 'medium', isDefault: true },
  { id: 't2', name: 'STUDY SESSION', type: 'learning', duration: 45, xpValue: 60, difficulty: 'medium', isDefault: true },
  { id: 't3', name: 'COLD SHOWER', type: 'discipline', duration: 5, xpValue: 30, difficulty: 'easy', isDefault: true },
  { id: 't4', name: 'READ 20 PAGES', type: 'skill', duration: 25, xpValue: 40, difficulty: 'easy', isDefault: true },
  { id: 't5', name: 'WORKOUT', type: 'physical', duration: 60, xpValue: 80, difficulty: 'hard', isDefault: true },
];

export const DIFFICULTY_XP_MULTIPLIER = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  extreme: 3,
};

export const BASE_XP_PER_MINUTE = 2;
