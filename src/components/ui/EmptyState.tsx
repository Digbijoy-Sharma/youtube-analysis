import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-400">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-black italic tracking-tight mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8 text-sm italic font-medium leading-relaxed">
        {description}
      </p>
      {action && (
        <Button 
          variant="secondary" 
          onClick={action.onClick}
          className="px-8 border-none bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
