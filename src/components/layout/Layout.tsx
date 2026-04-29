import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Toaster } from 'react-hot-toast';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme } = useSettingsStore();

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      theme === 'dark' ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      <Sidebar />
      <div className="flex flex-col min-h-screen md:pl-60 transition-[padding] duration-200" id="main-content-wrapper">
        <TopBar />
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-8">
          {children}
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: theme === 'dark' ? '!bg-surface-elevated-dark !text-text-primary-dark !border-border-dark' : '',
        }}
      />
    </div>
  );
}
