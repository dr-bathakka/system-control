import { motion } from 'framer-motion';
import { UserStats } from '@/types/system';
import { TrendingUp, Target, Skull, Award } from 'lucide-react';

interface StatsPageProps {
  stats: UserStats;
  onBack: () => void;
}

const StatsPage = ({ stats, onBack }: StatsPageProps) => {
  const statItems = [
    { 
      label: 'TOTAL XP EARNED', 
      value: stats.totalXpEarned.toLocaleString(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-system-glow'
    },
    { 
      label: 'TASKS COMPLETED', 
      value: stats.totalTasksCompleted,
      icon: <Target className="w-5 h-5" />,
      color: 'text-success'
    },
    { 
      label: 'CURRENT STREAK', 
      value: stats.streak,
      icon: <Award className="w-5 h-5" />,
      color: 'text-warning'
    },
    { 
      label: 'FAILURES', 
      value: stats.failCount,
      icon: <Skull className="w-5 h-5" />,
      color: 'text-destructive'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen p-6"
    >
      <div className="noise-overlay" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-xl font-bold tracking-wider">STATISTICS</h1>
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          BACK
        </button>
      </motion.div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="system-card rounded-xl p-6 mb-6 text-center system-glow"
      >
        <p className="system-title mb-2">CURRENT LEVEL</p>
        <p className="text-6xl font-bold mb-2">{stats.level}</p>
        <p className="text-lg text-system-glow font-semibold tracking-wider">{stats.rank}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className="system-card rounded-lg p-4"
          >
            <div className={`mb-2 ${item.color}`}>
              {item.icon}
            </div>
            <p className="text-2xl font-bold mb-1">{item.value}</p>
            <p className="text-xs text-muted-foreground tracking-wider">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress to Next Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="system-card rounded-lg p-4 mt-6"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="system-title">PROGRESS TO NEXT LEVEL</p>
          <p className="text-xs text-muted-foreground">
            {stats.xp} / {stats.xpToNextLevel} XP
          </p>
        </div>
        <div className="xp-bar h-3">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsPage;
