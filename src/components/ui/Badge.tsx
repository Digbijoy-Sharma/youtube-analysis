import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'indigo' | 'outline' | 'primary' | 'secondary' | 'emerald';
  className?: string;
  key?: any;
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  const variants = {
    default: isDark ? "bg-surface-elevated-dark text-slate-400 border-slate-700" : "bg-slate-100 text-slate-500 border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    error: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    primary: "bg-indigo-600 text-white border-indigo-500",
    secondary: isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200",
    outline: "bg-transparent border-current"
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold border tabular-nums uppercase tracking-tight",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
