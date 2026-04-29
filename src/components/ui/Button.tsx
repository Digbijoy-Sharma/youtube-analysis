import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'default' | 'indigo' | 'success' | 'warning' | 'error' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  disabled?: boolean;
  key?: any;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading,
  disabled,
  ...props 
}: ButtonProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  const variants = {
    primary: "bg-primary-indigo text-white hover:brightness-110",
    default: "bg-primary-indigo text-white hover:brightness-110",
    indigo: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    error: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: isDark ? "bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600" : "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200",
    danger: "bg-error-red text-white hover:brightness-110",
    ghost: "bg-transparent text-inherit hover:bg-surface-elevated-dark",
    outline: "bg-transparent border border-current hover:bg-surface-elevated-dark"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };

  return (
    <motion.button
      whileActive={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
}
