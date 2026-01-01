import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '@/hooks/useSystem';
import SystemBoot from '@/components/SystemBoot';
import StatusBar from '@/components/StatusBar';
import TaskCard from '@/components/TaskCard';
import TaskTimer from '@/components/TaskTimer';
import RewardsSection from '@/components/RewardsSection';
import StatsPage from '@/components/StatsPage';
import AchievementsPage from '@/components/AchievementsPage';
import ProgressCharts from '@/components/ProgressCharts';
import TaskCreator from '@/components/TaskCreator';
import { AchievementUnlock } from '@/components/AchievementBadge';
import { Task } from '@/types/system';
import { BarChart3, Trophy, LineChart, Settings } from 'lucide-react';

type Page = 'home' | 'stats' | 'achievements' | 'progress' | 'tasks';

const Index = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const {
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
  } = useSystem();

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
  }, []);

  const handleStartTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      startTask(taskId);
      setActiveTask(task);
    }
  }, [tasks, startTask]);

  const handleCloseTimer = useCallback(() => {
    setActiveTask(null);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Boot Screen */}
      <AnimatePresence>
        {showBoot && <SystemBoot onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementUnlock 
            achievement={newAchievement} 
            onDismiss={dismissAchievement}
          />
        )}
      </AnimatePresence>

      {/* Timer Screen */}
      <AnimatePresence>
        {activeTask && (
          <TaskTimer
            task={activeTask}
            onComplete={completeTask}
            onFail={failTask}
            onClose={handleCloseTimer}
          />
        )}
      </AnimatePresence>

      {/* Stats Page */}
      <AnimatePresence>
        {currentPage === 'stats' && (
          <StatsPage stats={stats} onBack={() => setCurrentPage('home')} />
        )}
      </AnimatePresence>

      {/* Achievements Page */}
      <AnimatePresence>
        {currentPage === 'achievements' && (
          <AchievementsPage 
            achievements={achievements} 
            onBack={() => setCurrentPage('home')} 
          />
        )}
      </AnimatePresence>

      {/* Progress Charts Page */}
      <AnimatePresence>
        {currentPage === 'progress' && (
          <ProgressCharts 
            dailyLogs={dailyLogs} 
            onBack={() => setCurrentPage('home')} 
          />
        )}
      </AnimatePresence>

      {/* Task Creator Page */}
      <AnimatePresence>
        {currentPage === 'tasks' && (
          <TaskCreator
            templates={taskTemplates}
            onAddTemplate={addTaskTemplate}
            onRemoveTemplate={removeTaskTemplate}
            onUpdateTemplate={updateTaskTemplate}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showBoot && !activeTask && currentPage === 'home' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen p-6 pb-24"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-xl font-bold tracking-[0.3em]">SYSTEM</h1>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('progress')}
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <LineChart className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('achievements')}
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-warning transition-colors"
              >
                <Trophy className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('stats')}
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Penalty Warning */}
          {stats.consecutiveFailures > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <p className="text-xs text-destructive text-center">
                ⚠ PENALTY ACTIVE: {stats.consecutiveFailures} consecutive failures
                {stats.difficultyMultiplier > 1 && (
                  <span className="block text-[10px] text-destructive/70 mt-1">
                    Task duration increased by {Math.round((stats.difficultyMultiplier - 1) * 100)}%
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* Status Bar */}
          <StatusBar stats={stats} systemMessage={systemMessage} />

          {/* Today's Quests */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="system-title">TODAY'S QUESTS</h2>
              <button
                onClick={() => setCurrentPage('tasks')}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>MANAGE</span>
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onStart={handleStartTask}
                />
              ))}
            </div>
          </motion.div>

          {/* Progress Indicator */}
          {pendingTasks.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-muted-foreground mt-6"
            >
              {tasks.length - pendingTasks.length} / {tasks.length} completed
            </motion.p>
          )}

          {/* Rewards Section */}
          <div className="mt-8">
            <RewardsSection
              rewards={rewards}
              allTasksCompleted={allTasksCompleted}
              onUseReward={useReward}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Index;
