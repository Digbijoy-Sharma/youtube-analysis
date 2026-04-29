import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  ArrowLeftRight, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Zap, 
  Bookmark, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Youtube
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { type: 'header', label: 'ANALYSIS' },
  { id: 'video', label: 'Video Analyzer', icon: Video, path: '/video' },
  { id: 'channel', label: 'Channel Analyzer', icon: Users, path: '/channel' },
  { id: 'compare', label: 'Compare', icon: ArrowLeftRight, path: '/compare' },
  { type: 'header', label: 'INTELLIGENCE' },
  { id: 'seo', label: 'SEO Intelligence', icon: Search, path: '/seo' },
  { id: 'strategy', label: 'Content Strategy', icon: TrendingUp, path: '/strategy' },
  { id: 'comments', label: 'Comment Intel', icon: MessageSquare, path: '/comments' },
  { type: 'header', label: 'TOOLS' },
  { id: 'preupload', label: 'Pre-Upload Optimizer', icon: Zap, path: '/preupload' },
  { type: 'header', label: 'LIBRARY' },
  { id: 'watchlist', label: 'Watchlist', icon: Bookmark, path: '/watchlist' },
  { id: 'history', label: 'Intelligence Log', icon: History, path: '/history' },
  { type: 'divider' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useSettingsStore();
  const location = useLocation();

  const isDark = theme === 'dark';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 border-r transition-colors duration-200 hidden md:flex flex-col",
        isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light shadow-sm"
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 font-bold text-lg tracking-tight overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 bg-primary-indigo rounded flex items-center justify-center text-white font-bold text-lg">Y</div>
              <span className={isDark ? "text-text-primary-dark" : "text-slate-900"}>
                YouTubeIntel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsed && <div className="w-8 h-8 bg-primary-indigo rounded flex items-center justify-center text-white font-bold text-sm mx-auto">Y</div>}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        {navItems.map((item, idx) => {
          if (item.type === 'header') {
            return !isCollapsed && (
              <div key={idx} className="px-6 py-2">
                <span className={cn(
                  "text-[10px] font-bold tracking-wider",
                  isDark ? "text-text-faint-dark" : "text-text-muted-light/60"
                )}>
                  {item.label}
                </span>
              </div>
            );
          }

          if (item.type === 'divider') {
            return <div key={idx} className={cn("mx-4 my-2 border-t", isDark ? "border-border-dark" : "border-border-light")} />;
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon!;

          return (
            <Link
              key={item.id}
              to={item.path!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all duration-200 group relative",
                isActive 
                  ? (isDark ? "bg-primary-indigo/20 text-primary-indigo font-medium" : "bg-indigo-50 text-primary-indigo font-medium")
                  : (isDark ? "text-text-muted-dark hover:bg-surface-elevated-dark hover:text-text-primary-dark" : "text-slate-600 hover:bg-slate-50")
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-elevated-dark text-text-primary-dark text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "h-12 border-t flex items-center justify-center transition-colors duration-200",
          isDark ? "border-border-dark text-text-faint-dark hover:text-text-primary-dark" : "border-border-light text-text-muted-light hover:text-text-primary-light"
        )}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
