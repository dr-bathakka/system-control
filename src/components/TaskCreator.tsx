import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskType, TaskTemplate, DIFFICULTY_XP_MULTIPLIER, BASE_XP_PER_MINUTE } from '@/types/system';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Dumbbell, 
  BookOpen, 
  Shield, 
  Target,
  Clock,
  Zap,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface TaskCreatorProps {
  templates: TaskTemplate[];
  onAddTemplate: (template: Omit<TaskTemplate, 'id' | 'xpValue'>) => void;
  onRemoveTemplate: (id: string) => void;
  onUpdateTemplate: (id: string, updates: Partial<TaskTemplate>) => void;
  onBack: () => void;
}

const typeIcons: Record<TaskType, React.ReactNode> = {
  physical: <Dumbbell className="w-5 h-5" />,
  learning: <BookOpen className="w-5 h-5" />,
  discipline: <Shield className="w-5 h-5" />,
  skill: <Target className="w-5 h-5" />,
};

const typeLabels: Record<TaskType, string> = {
  physical: 'Physical',
  learning: 'Learning',
  discipline: 'Discipline',
  skill: 'Skill',
};

const difficultyLabels = ['easy', 'medium', 'hard', 'extreme'] as const;

const TaskCreator = ({ 
  templates, 
  onAddTemplate, 
  onRemoveTemplate, 
  onUpdateTemplate,
  onBack 
}: TaskCreatorProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<number>(0);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<TaskType>('physical');
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');

  const calculateXp = (dur: number, diff: typeof difficulty) => {
    return Math.floor(dur * BASE_XP_PER_MINUTE * DIFFICULTY_XP_MULTIPLIER[diff]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onAddTemplate({
      name: name.toUpperCase(),
      type,
      duration,
      difficulty,
      isDefault: false,
    });
    
    // Reset form
    setName('');
    setType('physical');
    setDuration(30);
    setDifficulty('medium');
    setShowForm(false);
  };

  const handleStartEdit = (template: TaskTemplate) => {
    setEditingId(template.id);
    setEditDuration(template.duration);
  };

  const handleSaveEdit = (templateId: string) => {
    onUpdateTemplate(templateId, { duration: editDuration });
    setEditingId(null);
  };

  const customTemplates = templates.filter(t => !t.isDefault);
  const defaultTemplates = templates.filter(t => t.isDefault);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wider">QUESTS</h1>
            <p className="text-xs text-muted-foreground">Manage your daily tasks</p>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-lg bg-system-glow/20 flex items-center justify-center text-system-glow hover:bg-system-glow/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="system-card rounded-xl p-4 mb-6"
        >
          <h3 className="system-title mb-4">CREATE NEW QUEST</h3>
          
          {/* Name */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., MEDITATION"
              maxLength={30}
              className="w-full bg-muted rounded-lg px-4 py-3 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-system-glow/50"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">CATEGORY</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(typeIcons) as TaskType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-1 transition-all
                    ${type === t 
                      ? 'bg-system-glow/20 text-system-glow border border-system-glow/30' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  {typeIcons[t]}
                  <span className="text-[10px] tracking-wider">{typeLabels[t].toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">
              DURATION: {duration} MINUTES
            </label>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-system-glow"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>5m</span>
              <span>30m</span>
              <span>60m</span>
              <span>90m</span>
              <span>120m</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">DIFFICULTY</label>
            <div className="grid grid-cols-4 gap-2">
              {difficultyLabels.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`
                    py-2 px-3 rounded-lg text-xs uppercase tracking-wider transition-all
                    ${difficulty === d 
                      ? d === 'easy' ? 'bg-success/20 text-success border border-success/30'
                        : d === 'medium' ? 'bg-warning/20 text-warning border border-warning/30'
                        : 'bg-destructive/20 text-destructive border border-destructive/30'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* XP Preview */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-4">
            <span className="text-xs text-muted-foreground">XP REWARD</span>
            <span className="text-lg font-bold text-system-glow">
              +{calculateXp(duration, difficulty)} XP
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3 rounded-lg bg-system-glow/20 text-system-glow font-medium hover:bg-system-glow/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CREATE QUEST
          </button>
        </motion.div>
      )}

      {/* Custom Tasks */}
      {customTemplates.length > 0 && (
        <div className="mb-6">
          <h2 className="system-title mb-3">CUSTOM QUESTS</h2>
          <div className="space-y-2">
            {customTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="system-card rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    {typeIcons[template.type]}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold tracking-wide">{template.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {editingId === template.id ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <input
                            type="number"
                            min={5}
                            max={120}
                            value={editDuration}
                            onChange={(e) => setEditDuration(Number(e.target.value))}
                            className="w-16 bg-muted rounded px-2 py-1 text-xs"
                          />
                          <span>min</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{template.duration}m</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-system-glow" />
                        <span>+{template.xpValue} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === template.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(template.id)}
                          className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success hover:bg-success/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(template)}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveTemplate(template.id)}
                          className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Default Tasks */}
      <div>
        <h2 className="system-title mb-3">DEFAULT QUESTS</h2>
        <div className="space-y-2">
          {defaultTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="system-card rounded-lg p-4 opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  {typeIcons[template.type]}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-semibold tracking-wide">{template.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{template.duration}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-system-glow" />
                      <span>+{template.xpValue} XP</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  LOCKED
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Default quests cannot be modified
        </p>
      </div>
    </motion.div>
  );
};

export default TaskCreator;
