import { motion } from 'framer-motion';
import { Achievement } from '@/types/system';
import { AchievementBadge } from './AchievementBadge';
import { ArrowLeft, Trophy } from 'lucide-react';

interface AchievementsPageProps {
  achievements: Achievement[];
  onBack: () => void;
}

const AchievementsPage = ({ achievements, onBack }: AchievementsPageProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const groupedAchievements = {
    legendary: achievements.filter(a => a.rarity === 'legendary'),
    epic: achievements.filter(a => a.rarity === 'epic'),
    rare: achievements.filter(a => a.rarity === 'rare'),
    common: achievements.filter(a => a.rarity === 'common'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-6 pb-24"
    >
      <div className="noise-overlay" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-wider">ACHIEVEMENTS</h1>
          <p className="text-xs text-muted-foreground">{unlockedCount} / {totalCount} unlocked</p>
        </div>
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="system-card rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-warning/20 flex items-center justify-center text-warning">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="system-title mb-2">COMPLETION</p>
            <div className="xp-bar h-3">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((unlockedCount / totalCount) * 100)}% complete
            </p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Sections */}
      {Object.entries(groupedAchievements).map(([rarity, group]) => (
        group.length > 0 && (
          <motion.div
            key={rarity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="system-title mb-3 capitalize">{rarity}</h2>
            <div className="grid grid-cols-2 gap-3">
              {group.map((achievement, index) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )
      ))}
    </motion.div>
  );
};

export default AchievementsPage;
