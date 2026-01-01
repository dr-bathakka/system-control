import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemBootProps {
  onComplete: () => void;
}

const SystemBoot = ({ onComplete }: SystemBootProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => onComplete(), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="noise-overlay" />
      
      <AnimatePresence mode="wait">
        {phase >= 1 && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-5xl font-bold tracking-[0.5em] text-foreground">
                SYSTEM
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 2 && (
            <motion.p
              key="init"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="system-title"
            >
              INITIALIZING...
            </motion.p>
          )}
          {phase === 3 && (
            <motion.p
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="system-title"
            >
              LOADING PROFILE...
            </motion.p>
          )}
          {phase === 4 && (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="system-title text-success"
            >
              SYSTEM READY
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-muted overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-system-glow"
          initial={{ width: '0%' }}
          animate={{ width: `${(phase / 4) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SystemBoot;
