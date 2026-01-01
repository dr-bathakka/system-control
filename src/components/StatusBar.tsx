import { motion } from 'framer-motion';
import { UserStats } from '@/types/system';
import { Flame, Zap } from 'lucide-react';

interface StatusBarProps {
  stats: UserStats;
  systemMessage: string;
}

const StatusBar = ({ stats, systemMessage }: StatusBarProps) => {
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      {/* System Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mb-6"
      >
        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
          "{systemMessage}"
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="system-card rounded-lg p-4 text-center"
        >
          <p className="system-title mb-1">LEVEL</p>
          <p className="text-3xl font-bold tracking-tight">{stats.level}</p>
        </motion.div>

        {/* Rank */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="system-card rounded-lg p-4 text-center system-glow"
        >
          <p className="system-title mb-1">RANK</p>
          <p className="text-lg font-bold tracking-wider text-system-glow">{stats.rank}</p>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="system-card rounded-lg p-4 text-center"
        >
          <p className="system-title mb-1">STREAK</p>
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-warning" />
            <p className="text-3xl font-bold tracking-tight">{stats.streak}</p>
          </div>
        </motion.div>
      </div>

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="system-card rounded-lg p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-system-glow" />
            <span className="system-title">EXPERIENCE</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {stats.xp} / {stats.xpToNextLevel} XP
          </span>
        </div>
        <div className="xp-bar">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusBar;
