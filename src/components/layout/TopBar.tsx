import { motion } from 'motion/react';
import { Sun, Moon, Search, Key, User } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { cn } from '../../lib/utils';
import { useLocation } from 'react-router-dom';

export function TopBar() {
  const { theme, toggleTheme, apiKeys, activeKeyId } = useSettingsStore();
  const location = useLocation();
  const isDark = theme === 'dark';

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  const activeKey = apiKeys.find(k => k.id === activeKeyId);

  return (
    <header className={cn(
      "h-16 sticky top-0 z-40 border-b flex items-center justify-between px-8 transition-colors duration-200",
      isDark ? "bg-bg-dark/80 border-border-dark backdrop-blur-md" : "bg-white border-slate-200 backdrop-blur-md"
    )}>
      <div className="flex items-center gap-4">
        <span className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          isDark ? "text-text-faint-dark" : "text-slate-400"
        )}>
          {getBreadcrumb()}
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden sm:block">
        <div className={cn(
          "relative group flex items-center rounded-md px-4 py-1.5 border transition-all duration-200",
          isDark ? "bg-surface-elevated-dark border-border-dark focus-within:border-primary-indigo" : "bg-slate-50 border-slate-200 focus-within:border-primary-indigo focus-within:bg-white"
        )}>
          <Search size={16} className={isDark ? "text-text-faint-dark" : "text-slate-400"} />
          <input 
            type="text" 
            placeholder="Search analysis history..." 
            className="bg-transparent border-none outline-none text-sm px-3 flex-1 text-inherit placeholder:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {activeKey && (
          <div className={cn(
            "hidden lg:flex items-center gap-2 px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold tracking-tight",
            isDark ? "bg-surface-dark border-border-dark text-success-green" : "bg-emerald-50 border-emerald-100 text-emerald-700"
          )}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            V3 LIVE
          </div>
        )}

        <button 
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-lg border transition-colors duration-200",
            isDark ? "bg-surface-dark border-border-dark text-text-muted-dark hover:text-text-primary-dark" : "bg-surface-light border-border-light text-text-muted-light hover:text-text-primary-light"
          )}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className={cn(
          "p-2 rounded-lg border transition-colors duration-200",
          isDark ? "bg-surface-dark border-border-dark text-text-muted-dark hover:text-text-primary-dark" : "bg-surface-light border-border-light text-text-muted-light hover:text-text-primary-light"
        )}>
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
