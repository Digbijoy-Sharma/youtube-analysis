import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 8, 
  label = 'SEO Score',
  className 
}: ScoreRingProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return '#10b981'; // green
    if (s >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor(score);

  return (
    <div className={cn("flex flex-col items-center justify-center relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isDark ? '#334155' : '#f1f5f9'}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black tabular-nums tracking-tight" style={{ color }}>{score}</span>
        {label && <span className="text-[10px] font-bold text-text-faint-dark uppercase tracking-widest">{label}</span>}
      </div>
    </div>
  );
}
