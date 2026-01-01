import { useState, useEffect, useCallback } from 'react';
import { Task, UserStats, Reward, RANKS, SYSTEM_MESSAGES } from '@/types/system';

const STORAGE_KEY = 'system_data';

interface SystemData {
  stats: UserStats;
  tasks: Task[];
  rewards: Reward[];
  lastActiveDate: string;
}

const getDefaultTasks = (): Task[] => [
  { id: '1', name: 'MORNING RUN', type: 'physical', duration: 30, xpValue: 50, difficulty: 'medium', status: 'pending' },
  { id: '2', name: 'STUDY SESSION', type: 'learning', duration: 45, xpValue: 60, difficulty: 'medium', status: 'pending' },
  { id: '3', name: 'COLD SHOWER', type: 'discipline', duration: 5, xpValue: 30, difficulty: 'easy', status: 'pending' },
  { id: '4', name: 'READ 20 PAGES', type: 'skill', duration: 25, xpValue: 40, difficulty: 'easy', status: 'pending' },
  { id: '5', name: 'WORKOUT', type: 'physical', duration: 60, xpValue: 80, difficulty: 'hard', status: 'pending' },
];

const getDefaultRewards = (): Reward[] => [
  { id: 'r1', name: 'Social Media', icon: 'smartphone', unlocked: false, timeLimit: 30 },
  { id: 'r2', name: 'Gaming', icon: 'gamepad-2', unlocked: false, timeLimit: 60 },
  { id: 'r3', name: 'Videos', icon: 'play', unlocked: false, timeLimit: 45 },
];

const getDefaultStats = (): UserStats => ({
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  rank: 'WEAK',
  totalTasksCompleted: 0,
  totalXpEarned: 0,
  failCount: 0,
});

const calculateRank = (level: number): string => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].level) {
      return RANKS[i].name;
    }
  }
  return 'WEAK';
};

const calculateXpToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const useSystem = () => {
  const [stats, setStats] = useState<UserStats>(getDefaultStats());
  const [tasks, setTasks] = useState<Task[]>(getDefaultTasks());
  const [rewards, setRewards] = useState<Reward[]>(getDefaultRewards());
  const [systemMessage, setSystemMessage] = useState<string>(SYSTEM_MESSAGES[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: SystemData = JSON.parse(stored);
        const today = new Date().toDateString();
        
        if (data.lastActiveDate !== today) {
          // New day - reset tasks, keep stats
          setStats(data.stats);
          setTasks(getDefaultTasks());
          setRewards(getDefaultRewards().map(r => ({ ...r, unlocked: false })));
        } else {
          setStats(data.stats);
          setTasks(data.tasks);
          setRewards(data.rewards);
        }
      } catch {
        // Use defaults
      }
    }
    setIsLoaded(true);
    setSystemMessage(SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)]);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      const data: SystemData = {
        stats,
        tasks,
        rewards,
        lastActiveDate: new Date().toDateString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [stats, tasks, rewards, isLoaded]);

  const startTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'in_progress' as const } : t
    ));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const, completedAt: new Date() } : t
    ));

    setStats(prev => {
      const newXp = prev.xp + task.xpValue;
      const xpToNext = calculateXpToNextLevel(prev.level);
      
      if (newXp >= xpToNext) {
        const newLevel = prev.level + 1;
        return {
          ...prev,
          level: newLevel,
          xp: newXp - xpToNext,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
          rank: calculateRank(newLevel),
          totalTasksCompleted: prev.totalTasksCompleted + 1,
          totalXpEarned: prev.totalXpEarned + task.xpValue,
        };
      }
      
      return {
        ...prev,
        xp: newXp,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        totalXpEarned: prev.totalXpEarned + task.xpValue,
      };
    });

    // Check if all tasks completed
    const remainingTasks = tasks.filter(t => t.id !== taskId && t.status === 'pending');
    if (remainingTasks.length === 0) {
      setRewards(prev => prev.map(r => ({ ...r, unlocked: true })));
      setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
    }
  }, [tasks]);

  const failTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'failed' as const } : t
    ));

    setStats(prev => ({
      ...prev,
      xp: Math.max(0, prev.xp - 20),
      failCount: prev.failCount + 1,
    }));
  }, []);

  const useReward = useCallback((rewardId: string) => {
    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, timeRemaining: r.timeLimit } : r
    ));
  }, []);

  const allTasksCompleted = tasks.every(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return {
    stats,
    tasks,
    rewards,
    systemMessage,
    isLoaded,
    startTask,
    completeTask,
    failTask,
    useReward,
    allTasksCompleted,
    pendingTasks,
    completedTasks,
  };
};
