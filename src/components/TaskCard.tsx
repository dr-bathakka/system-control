import { motion } from 'framer-motion';
import { Task, TaskType } from '@/types/system';
import { 
  Dumbbell, 
  BookOpen, 
  Shield, 
  Target,
  Clock,
  Zap,
  Check,
  X,
  Play
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onStart: (id: string) => void;
}

const typeIcons: Record<TaskType, React.ReactNode> = {
  physical: <Dumbbell className="w-5 h-5" />,
  learning: <BookOpen className="w-5 h-5" />,
  discipline: <Shield className="w-5 h-5" />,
  skill: <Target className="w-5 h-5" />,
};

const difficultyColors = {
  easy: 'text-success',
  medium: 'text-warning',
  hard: 'text-destructive',
  extreme: 'text-destructive',
};

const TaskCard = ({ task, index, onStart }: TaskCardProps) => {
  const isCompleted = task.status === 'completed';
  const isFailed = task.status === 'failed';
  const isPending = task.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: 0.1 * index,
        ease: [0.4, 0, 0.2, 1] 
      }}
      whileTap={isPending ? { scale: 0.98, y: 2 } : undefined}
      className={`
        system-card rounded-lg p-4 cursor-pointer
        ${isCompleted ? 'opacity-60' : ''}
        ${isFailed ? 'opacity-40' : ''}
      `}
      onClick={() => isPending && onStart(task.id)}
    >
      <div className="flex items-center gap-4">
        {/* Status/Icon */}
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          ${isCompleted ? 'bg-success/20 text-success' : ''}
          ${isFailed ? 'bg-destructive/20 text-destructive' : ''}
          ${isPending ? 'bg-muted text-muted-foreground' : ''}
        `}>
          {isCompleted ? (
            <Check className="w-6 h-6" />
          ) : isFailed ? (
            <X className="w-6 h-6" />
          ) : (
            typeIcons[task.type]
          )}
        </div>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`
              font-semibold tracking-wide text-sm
              ${isCompleted ? 'line-through text-muted-foreground' : ''}
              ${isFailed ? 'line-through text-muted-foreground' : ''}
            `}>
              {task.name}
            </h3>
            <span className={`text-xs uppercase tracking-wider ${difficultyColors[task.difficulty]}`}>
              {task.difficulty}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.duration}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-system-glow" />
              <span>+{task.xpValue} XP</span>
            </div>
          </div>
        </div>

        {/* Action */}
        {isPending && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-system-glow/20 flex items-center justify-center text-system-glow"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
