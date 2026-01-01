import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { DailyLog } from '@/types/system';
import { ArrowLeft, TrendingUp, Target, Flame, Skull } from 'lucide-react';

interface ProgressChartsProps {
  dailyLogs: DailyLog[];
  onBack: () => void;
}

const ProgressCharts = ({ dailyLogs, onBack }: ProgressChartsProps) => {
  // Prepare chart data for last 7 days and last 30 days
  const { weekData, monthData, weekStats, monthStats } = useMemo(() => {
    const today = new Date();
    const last7Days: string[] = [];
    const last30Days: string[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toDateString());
    }
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push(date.toDateString());
    }

    const mapToChartData = (dates: string[]) => 
      dates.map(date => {
        const log = dailyLogs.find(l => l.date === date);
        const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return {
          date: dayLabel,
          fullDate: date,
          xp: log?.xpEarned || 0,
          tasks: log?.tasksCompleted || 0,
          failed: log?.tasksFailed || 0,
          streak: log?.streakMaintained ? 1 : 0,
        };
      });

    const weekData = mapToChartData(last7Days);
    const monthData = mapToChartData(last30Days);

    const calculateStats = (data: typeof weekData) => ({
      totalXp: data.reduce((sum, d) => sum + d.xp, 0),
      totalTasks: data.reduce((sum, d) => sum + d.tasks, 0),
      totalFailed: data.reduce((sum, d) => sum + d.failed, 0),
      streakDays: data.filter(d => d.streak > 0).length,
    });

    return {
      weekData,
      monthData,
      weekStats: calculateStats(weekData),
      monthStats: calculateStats(monthData),
    };
  }, [dailyLogs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          <h1 className="text-xl font-bold tracking-wider">PROGRESS</h1>
          <p className="text-xs text-muted-foreground">Track your growth</p>
        </div>
      </div>

      {/* Weekly Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h2 className="system-title mb-3">THIS WEEK</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="system-card rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-system-glow mx-auto mb-1" />
            <p className="text-lg font-bold">{weekStats.totalXp}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Target className="w-4 h-4 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">{weekStats.totalTasks}</p>
            <p className="text-[10px] text-muted-foreground">DONE</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Flame className="w-4 h-4 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold">{weekStats.streakDays}</p>
            <p className="text-[10px] text-muted-foreground">STREAK</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Skull className="w-4 h-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold">{weekStats.totalFailed}</p>
            <p className="text-[10px] text-muted-foreground">FAILED</p>
          </div>
        </div>

        {/* Weekly XP Chart */}
        <div className="system-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-3">XP EARNED</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 15%, 35%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(210, 15%, 35%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="xp"
                  name="XP"
                  stroke="hsl(210, 15%, 45%)"
                  strokeWidth={2}
                  fill="url(#xpGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Monthly Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="system-title mb-3">THIS MONTH</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="system-card rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-system-glow mx-auto mb-1" />
            <p className="text-lg font-bold">{monthStats.totalXp}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Target className="w-4 h-4 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">{monthStats.totalTasks}</p>
            <p className="text-[10px] text-muted-foreground">DONE</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Flame className="w-4 h-4 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold">{monthStats.streakDays}</p>
            <p className="text-[10px] text-muted-foreground">STREAK</p>
          </div>
          <div className="system-card rounded-lg p-3 text-center">
            <Skull className="w-4 h-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold">{monthStats.totalFailed}</p>
            <p className="text-[10px] text-muted-foreground">FAILED</p>
          </div>
        </div>

        {/* Monthly Tasks Chart */}
        <div className="system-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-3">TASKS COMPLETED</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="tasks"
                  name="Tasks"
                  fill="hsl(145, 45%, 28%)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Streak Calendar Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="system-title mb-3">STREAK CALENDAR</h2>
        <div className="system-card rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1">
            {monthData.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm flex items-center justify-center text-[8px]
                  ${day.streak ? 'bg-success/40 text-success' : 'bg-muted/30 text-muted-foreground'}
                `}
                title={day.fullDate}
              >
                {new Date(day.fullDate).getDate()}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Last 30 days • Green = streak maintained
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressCharts;
