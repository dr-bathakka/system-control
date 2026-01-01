import { useState, useEffect, useCallback } from 'react';
import { 
  Task, 
  UserStats, 
  Reward, 
  Achievement,
  DailyLog,
  TaskTemplate,
  RANKS, 
  SYSTEM_MESSAGES,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_TASK_TEMPLATES,
  DIFFICULTY_XP_MULTIPLIER,
  BASE_XP_PER_MINUTE,
} from '@/types/system';

const STORAGE_KEY = 'system_data';

interface SystemData {
  stats: UserStats;
  tasks: Task[];
  rewards: Reward[];
  achievements: Achievement[];
  dailyLogs: DailyLog[];
  taskTemplates: TaskTemplate[];
  lastActiveDate: string;
  failuresBeforeRecovery: number;
}

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
  consecutiveFailures: 0,
  difficultyMultiplier: 1,
  longestStreak: 0,
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

const calculateTaskXp = (template: TaskTemplate, multiplier: number): number => {
  const baseXp = template.duration * BASE_XP_PER_MINUTE;
  const difficultyBonus = DIFFICULTY_XP_MULTIPLIER[template.difficulty];
  return Math.floor(baseXp * difficultyBonus * multiplier);
};

const generateTasksFromTemplates = (templates: TaskTemplate[], multiplier: number): Task[] => {
  return templates.map(t => ({
    id: t.id,
    name: t.name,
    type: t.type,
    duration: Math.ceil(t.duration * multiplier),
    xpValue: calculateTaskXp(t, 1),
    difficulty: t.difficulty,
    status: 'pending' as const,
    isCustom: !t.isDefault,
  }));
};

export const useSystem = () => {
  const [stats, setStats] = useState<UserStats>(getDefaultStats());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(getDefaultRewards());
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(DEFAULT_TASK_TEMPLATES);
  const [systemMessage, setSystemMessage] = useState<string>(SYSTEM_MESSAGES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [failuresBeforeRecovery, setFailuresBeforeRecovery] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    
    if (stored) {
      try {
        const data: SystemData = JSON.parse(stored);
        
        setStats(data.stats || getDefaultStats());
        setAchievements(data.achievements || DEFAULT_ACHIEVEMENTS);
        setDailyLogs(data.dailyLogs || []);
        setTaskTemplates(data.taskTemplates || DEFAULT_TASK_TEMPLATES);
        setFailuresBeforeRecovery(data.failuresBeforeRecovery || 0);
        
        if (data.lastActiveDate !== today) {
          // New day - generate fresh tasks from templates
          const templates = data.taskTemplates || DEFAULT_TASK_TEMPLATES;
          const multiplier = data.stats?.difficultyMultiplier || 1;
          setTasks(generateTasksFromTemplates(templates, multiplier));
          setRewards(getDefaultRewards().map(r => ({ ...r, unlocked: false })));
        } else {
          setTasks(data.tasks || generateTasksFromTemplates(DEFAULT_TASK_TEMPLATES, 1));
          setRewards(data.rewards || getDefaultRewards());
        }
      } catch {
        setTasks(generateTasksFromTemplates(DEFAULT_TASK_TEMPLATES, 1));
      }
    } else {
      setTasks(generateTasksFromTemplates(DEFAULT_TASK_TEMPLATES, 1));
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
        achievements,
        dailyLogs,
        taskTemplates,
        lastActiveDate: new Date().toDateString(),
        failuresBeforeRecovery,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [stats, tasks, rewards, achievements, dailyLogs, taskTemplates, isLoaded, failuresBeforeRecovery]);

  // Check achievements
  const checkAchievements = useCallback((currentStats: UserStats) => {
    setAchievements(prev => {
      const updated = [...prev];
      let newUnlock: Achievement | null = null;
      
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].unlocked) continue;
        
        const { type, value } = updated[i].requirement;
        let achieved = false;
        
        switch (type) {
          case 'tasks':
            achieved = currentStats.totalTasksCompleted >= value;
            break;
          case 'streak':
            achieved = currentStats.streak >= value || currentStats.longestStreak >= value;
            break;
          case 'level':
            achieved = currentStats.level >= value;
            break;
          case 'xp':
            achieved = currentStats.totalXpEarned >= value;
            break;
          case 'failures_overcome':
            achieved = failuresBeforeRecovery >= value && currentStats.consecutiveFailures === 0;
            break;
        }
        
        if (achieved) {
          updated[i] = {
            ...updated[i],
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
          newUnlock = updated[i];
        }
      }
      
      if (newUnlock) {
        setNewAchievement(newUnlock);
        setTimeout(() => setNewAchievement(null), 4000);
      }
      
      return updated;
    });
  }, [failuresBeforeRecovery]);

  // Update daily log
  const updateDailyLog = useCallback((xp: number, completed: boolean, failed: boolean) => {
    const today = new Date().toDateString();
    
    setDailyLogs(prev => {
      const existing = prev.find(l => l.date === today);
      
      if (existing) {
        return prev.map(l => l.date === today ? {
          ...l,
          xpEarned: l.xpEarned + xp,
          tasksCompleted: l.tasksCompleted + (completed ? 1 : 0),
          tasksFailed: l.tasksFailed + (failed ? 1 : 0),
        } : l);
      }
      
      return [...prev.slice(-30), { // Keep last 30 days
        date: today,
        xpEarned: xp,
        tasksCompleted: completed ? 1 : 0,
        tasksFailed: failed ? 1 : 0,
        streakMaintained: false,
      }];
    });
  }, []);

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

    // Track if we're recovering from failures
    if (stats.consecutiveFailures > 0) {
      setFailuresBeforeRecovery(stats.consecutiveFailures);
    }

    setStats(prev => {
      const newXp = prev.xp + task.xpValue;
      const xpToNext = calculateXpToNextLevel(prev.level);
      
      let newStats: UserStats;
      
      if (newXp >= xpToNext) {
        const newLevel = prev.level + 1;
        newStats = {
          ...prev,
          level: newLevel,
          xp: newXp - xpToNext,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
          rank: calculateRank(newLevel),
          totalTasksCompleted: prev.totalTasksCompleted + 1,
          totalXpEarned: prev.totalXpEarned + task.xpValue,
          consecutiveFailures: 0,
          difficultyMultiplier: Math.max(1, prev.difficultyMultiplier - 0.05),
        };
      } else {
        newStats = {
          ...prev,
          xp: newXp,
          totalTasksCompleted: prev.totalTasksCompleted + 1,
          totalXpEarned: prev.totalXpEarned + task.xpValue,
          consecutiveFailures: 0,
          difficultyMultiplier: Math.max(1, prev.difficultyMultiplier - 0.05),
        };
      }
      
      checkAchievements(newStats);
      return newStats;
    });

    updateDailyLog(task.xpValue, true, false);

    // Check if all tasks completed
    const remainingTasks = tasks.filter(t => t.id !== taskId && t.status === 'pending');
    if (remainingTasks.length === 0) {
      setRewards(prev => prev.map(r => ({ ...r, unlocked: true })));
      setStats(prev => {
        const newStreak = prev.streak + 1;
        const newStats = { 
          ...prev, 
          streak: newStreak,
          longestStreak: Math.max(prev.longestStreak, newStreak),
        };
        checkAchievements(newStats);
        return newStats;
      });
      
      // Mark streak maintained in daily log
      setDailyLogs(prev => prev.map(l => 
        l.date === new Date().toDateString() ? { ...l, streakMaintained: true } : l
      ));
    }
  }, [tasks, stats.consecutiveFailures, checkAchievements, updateDailyLog]);

  const failTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'failed' as const } : t
    ));

    setStats(prev => {
      const newConsecutive = prev.consecutiveFailures + 1;
      const newMultiplier = Math.min(2, prev.difficultyMultiplier + 0.1 * newConsecutive);
      
      const newStats = {
        ...prev,
        xp: Math.max(0, prev.xp - 20),
        failCount: prev.failCount + 1,
        consecutiveFailures: newConsecutive,
        difficultyMultiplier: newMultiplier,
        streak: newConsecutive >= 3 ? Math.max(0, prev.streak - 1) : prev.streak,
      };
      
      return newStats;
    });

    updateDailyLog(-20, false, true);
  }, [updateDailyLog]);

  const useReward = useCallback((rewardId: string) => {
    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, timeRemaining: r.timeLimit } : r
    ));
  }, []);

  const addTaskTemplate = useCallback((template: Omit<TaskTemplate, 'id' | 'xpValue'>) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: `custom_${Date.now()}`,
      xpValue: calculateTaskXp({ ...template, xpValue: 0, id: '' }, 1),
    };
    
    setTaskTemplates(prev => [...prev, newTemplate]);
    
    // Add to today's tasks
    const newTask: Task = {
      id: newTemplate.id,
      name: newTemplate.name,
      type: newTemplate.type,
      duration: Math.ceil(newTemplate.duration * stats.difficultyMultiplier),
      xpValue: newTemplate.xpValue,
      difficulty: newTemplate.difficulty,
      status: 'pending',
      isCustom: true,
    };
    
    setTasks(prev => [...prev, newTask]);
  }, [stats.difficultyMultiplier]);

  const removeTaskTemplate = useCallback((templateId: string) => {
    setTaskTemplates(prev => prev.filter(t => t.id !== templateId));
    setTasks(prev => prev.filter(t => t.id !== templateId));
  }, []);

  const updateTaskTemplate = useCallback((templateId: string, updates: Partial<TaskTemplate>) => {
    setTaskTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, ...updates, xpValue: calculateTaskXp({ ...t, ...updates }, 1) } : t
    ));
  }, []);

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return {
    stats,
    tasks,
    rewards,
    achievements,
    dailyLogs,
    taskTemplates,
    systemMessage,
    isLoaded,
    newAchievement,
    startTask,
    completeTask,
    failTask,
    useReward,
    addTaskTemplate,
    removeTaskTemplate,
    updateTaskTemplate,
    dismissAchievement,
    allTasksCompleted,
    pendingTasks,
    completedTasks,
  };
};
