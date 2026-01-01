import { motion } from 'framer-motion';
import { Reward } from '@/types/system';
import { Lock, Unlock, Smartphone, Gamepad2, Play } from 'lucide-react';

interface RewardsSectionProps {
  rewards: Reward[];
  allTasksCompleted: boolean;
  onUseReward: (id: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-6 h-6" />,
  'gamepad-2': <Gamepad2 className="w-6 h-6" />,
  play: <Play className="w-6 h-6" />,
};

const RewardsSection = ({ rewards, allTasksCompleted, onUseReward }: RewardsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        {allTasksCompleted ? (
          <Unlock className="w-5 h-5 text-success unlock-icon" />
        ) : (
          <Lock className="w-5 h-5 text-destructive lock-icon" />
        )}
        <h2 className="system-title">
          {allTasksCompleted ? 'REWARDS UNLOCKED' : 'REWARDS LOCKED'}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {rewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
            whileTap={reward.unlocked ? { scale: 0.95 } : undefined}
            onClick={() => reward.unlocked && onUseReward(reward.id)}
            className={`
              system-card rounded-lg p-4 text-center cursor-pointer
              ${reward.unlocked ? 'animate-pulse-glow' : 'opacity-50'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center
              ${reward.unlocked ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}
            `}>
              {iconMap[reward.icon]}
            </div>
            <p className="text-xs font-medium truncate">{reward.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{reward.timeLimit}m</p>
          </motion.div>
        ))}
      </div>

      {allTasksCompleted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-success mt-4 tracking-wide"
        >
          ACCESS GRANTED
        </motion.p>
      )}
    </motion.div>
  );
};

export default RewardsSection;
