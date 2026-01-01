import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/system';
import { X, AlertTriangle } from 'lucide-react';

interface TaskTimerProps {
  task: Task;
  onComplete: (id: string) => void;
  onFail: (id: string) => void;
  onClose: () => void;
}

const TaskTimer = ({ task, onComplete, onFail, onClose }: TaskTimerProps) => {
  const totalSeconds = task.duration * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [showQuitWarning, setShowQuitWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    if (timeLeft <= 0 && !isComplete) {
      setIsComplete(true);
      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      setTimeout(() => {
        onComplete(task.id);
        onClose();
      }, 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, task.id, onComplete, onClose, isComplete]);

  const handleQuit = useCallback(() => {
    setIsFailed(true);
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    setTimeout(() => {
      onFail(task.id);
      onClose();
    }, 1500);
  }, [task.id, onFail, onClose]);

  const handleQuitAttempt = () => {
    setShowQuitWarning(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center bg-background
        ${isComplete ? 'flash-success' : ''}
        ${isFailed ? 'flash-fail screen-shake' : ''}
      `}
    >
      <div className="noise-overlay" />
      
      {/* Close/Quit Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleQuitAttempt}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="w-5 h-5" />
      </motion.button>

      {/* Task Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <p className="system-title text-center mb-2">ACTIVE QUEST</p>
        <h2 className="text-2xl font-bold tracking-wider text-center">{task.name}</h2>
      </motion.div>

      {/* Timer Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative mb-8"
      >
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            className="timer-ring"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-6xl font-bold tracking-tight"
          >
            {timeDisplay}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-2">REMAINING</span>
        </div>
      </motion.div>

      {/* XP Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          Complete for <span className="text-system-glow font-semibold">+{task.xpValue} XP</span>
        </p>
      </motion.div>

      {/* Complete Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background/90"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-success tracking-wider mb-2">
                TASK CLEARED
              </p>
              <p className="text-lg text-success/70">+{task.xpValue} XP</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failed Overlay */}
      <AnimatePresence>
        {isFailed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background/90"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-destructive tracking-wider mb-2">
                PENALTY APPLIED
              </p>
              <p className="text-lg text-destructive/70">-20 XP</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quit Warning Modal */}
      <AnimatePresence>
        {showQuitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/95 z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="system-card rounded-xl p-6 max-w-sm mx-4 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">ABORT MISSION?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Quitting will result in task failure and XP penalty.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuitWarning(false)}
                  className="flex-1 py-3 px-4 rounded-lg bg-muted text-muted-foreground font-medium hover:bg-accent transition-colors"
                >
                  CONTINUE
                </button>
                <button
                  onClick={handleQuit}
                  className="flex-1 py-3 px-4 rounded-lg bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  QUIT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskTimer;
