import { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: any;
  className?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  type?: string;
  key?: any;
}

export function Input({ label, error, icon: Icon, className, ...props }: InputProps) {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none",
            Icon && "pl-11",
            isDark 
              ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500" 
              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-500/5",
            error && "border-rose-500 focus:border-rose-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight ml-1">{error}</p>}
    </div>
  );
}
