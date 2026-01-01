import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '@/hooks/useSystem';
import SystemBoot from '@/components/SystemBoot';
import StatusBar from '@/components/StatusBar';
import TaskCard from '@/components/TaskCard';
import TaskTimer from '@/components/TaskTimer';
import RewardsSection from '@/components/RewardsSection';
import StatsPage from '@/components/StatsPage';
import { Task } from '@/types/system';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  const {
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
        {showStats && (
          <StatsPage stats={stats} onBack={() => setShowStats(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showBoot && !activeTask && !showStats && (
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(true)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Status Bar */}
          <StatusBar stats={stats} systemMessage={systemMessage} />

          {/* Today's Quests */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-8"
          >
            <h2 className="system-title mb-4">TODAY'S QUESTS</h2>
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
