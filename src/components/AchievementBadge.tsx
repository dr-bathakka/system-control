import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/system';
import { 
  Footprints, Target, Award, Trophy, Crown,
  Flame, Calendar, Shield, TrendingUp, Star,
  Zap, Infinity, RotateCcw, Sparkles, X
} from 'lucide-react';

interface AchievementUnlockProps {
  achievement: Achievement;
  onDismiss: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  footprints: <Footprints className="w-8 h-8" />,
  target: <Target className="w-8 h-8" />,
  award: <Award className="w-8 h-8" />,
  trophy: <Trophy className="w-8 h-8" />,
  crown: <Crown className="w-8 h-8" />,
  flame: <Flame className="w-8 h-8" />,
  calendar: <Calendar className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  'trending-up': <TrendingUp className="w-8 h-8" />,
  star: <Star className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  bolt: <Zap className="w-8 h-8" />,
  infinity: <Infinity className="w-8 h-8" />,
  'rotate-ccw': <RotateCcw className="w-8 h-8" />,
  sparkles: <Sparkles className="w-8 h-8" />,
};

const rarityColors = {
  common: 'from-muted to-muted-foreground/20',
  rare: 'from-blue-500/30 to-blue-600/10',
  epic: 'from-purple-500/30 to-purple-600/10',
  legendary: 'from-amber-500/30 to-amber-600/10',
};

const rarityGlow = {
  common: '0 0 30px hsl(var(--muted-foreground) / 0.3)',
  rare: '0 0 40px rgba(59, 130, 246, 0.4)',
  epic: '0 0 50px rgba(168, 85, 247, 0.5)',
  legendary: '0 0 60px rgba(245, 158, 11, 0.6)',
};

const rarityTextColors = {
  common: 'text-muted-foreground',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

export const AchievementUnlock = ({ achievement, onDismiss }: AchievementUnlockProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ 
            type: "spring", 
            duration: 0.6,
            delay: 0.1 
          }}
          className="relative text-center p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Achievement title */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="system-title mb-6"
          >
            ACHIEVEMENT UNLOCKED
          </motion.p>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.4 
            }}
            style={{ boxShadow: rarityGlow[achievement.rarity] }}
            className={`
              w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center
              bg-gradient-to-br ${rarityColors[achievement.rarity]}
              border border-border/50
            `}
          >
            <div className={rarityTextColors[achievement.rarity]}>
              {iconMap[achievement.icon] || <Award className="w-8 h-8" />}
            </div>
          </motion.div>

          {/* Name */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`text-2xl font-bold tracking-wider mb-2 ${rarityTextColors[achievement.rarity]}`}
          >
            {achievement.name}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-muted-foreground mb-4"
          >
            {achievement.description}
          </motion.p>

          {/* Rarity */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`
              inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider
              ${rarityTextColors[achievement.rarity]} bg-muted
            `}
          >
            {achievement.rarity}
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

export const AchievementBadge = ({ achievement, index }: AchievementBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${achievement.unlocked 
          ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} border-border/50` 
          : 'bg-muted/30 border-border/20 opacity-50'
        }
      `}
      style={achievement.unlocked ? { boxShadow: rarityGlow[achievement.rarity].replace(/0\.[\d]+\)$/, '0.2)') } : undefined}
    >
      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-lg mb-3 flex items-center justify-center
        ${achievement.unlocked ? `bg-background/30 ${rarityTextColors[achievement.rarity]}` : 'bg-muted text-muted-foreground'}
      `}>
        {iconMap[achievement.icon] || <Award className="w-6 h-6" />}
      </div>

      {/* Name */}
      <h3 className={`
        text-xs font-bold tracking-wider mb-1
        ${achievement.unlocked ? rarityTextColors[achievement.rarity] : 'text-muted-foreground'}
      `}>
        {achievement.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2">
        {achievement.description}
      </p>

      {/* Lock overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
          <Shield className="w-6 h-6 text-muted-foreground/50" />
        </div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
