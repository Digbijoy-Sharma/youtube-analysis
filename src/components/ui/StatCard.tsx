import { Card } from './Card';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: string;
  color?: string;
  className?: string;
  [key: string]: any;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  trend = 'neutral', 
  trendPercent,
  color = 'text-primary-indigo',
  className
}: StatCardProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  return (
    <Card className={cn("flex flex-col gap-4 group", className)}>
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12",
          isDark ? "bg-slate-700" : "bg-slate-100",
          color
        )}>
          <Icon size={20} />
        </div>
        
        {trend !== 'neutral' && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
            trend === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
          )}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendPercent}
          </div>
        )}
        {trend === 'neutral' && <Minus size={14} className="text-slate-400" />}
      </div>

      <div>
        <h3 className="text-2xl font-black tabular-nums tracking-tight mb-1">{value}</h3>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          {subtext && <span className="text-[10px] text-slate-500 mt-1">{subtext}</span>}
        </div>
      </div>
    </Card>
  );
}
