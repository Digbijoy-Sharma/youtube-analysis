import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}

export function Card({ children, className, hover = true }: CardProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl border transition-all duration-200 relative overflow-hidden",
        isDark ? "bg-slate-800 border-slate-700 shadow-xl shadow-black/20" : "bg-white border-slate-200 shadow-sm hover:shadow-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
