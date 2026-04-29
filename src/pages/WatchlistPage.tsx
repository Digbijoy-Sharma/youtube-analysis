import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Filter, 
  ExternalLink,
  Youtube,
  User,
  Plus,
  RefreshCw,
  Tag as TagIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<'channels' | 'videos'>('channels');
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeItem, updateLabels } = useWatchlistStore();

  const filteredItems = items.filter(item => 
    item.type === (activeTab === 'channels' ? 'channel' : 'video') &&
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
             <Bookmark className="text-primary-indigo" size={32} />
             Watchlist
          </h1>
          <p className="text-slate-500 font-medium italic">Your curated list of competitors and viral benchmarks.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
           {(['channels', 'videos'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 text-primary-indigo shadow-lg" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
             >
               <span className="capitalize">{tab}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder={`Search ${activeTab}...`} 
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <Button variant="secondary" className="h-12 px-6 gap-2 border-none bg-slate-100 dark:bg-slate-800">
            <Filter size={16} /> Filter Labels
         </Button>
         <Button variant="emerald" className="h-12 px-8 gap-2 border-none">
            <RefreshCw size={16} /> Update All
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {filteredItems.map(item => (
           <Card key={item.id} className="p-0 overflow-hidden group hover:border-primary-indigo transition-all">
              <div className="aspect-video relative bg-slate-900 overflow-hidden">
                 <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                 <div className="absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 bg-black/50 hover:bg-rose-500 text-white rounded-lg backdrop-blur-md transition-colors"
                    >
                       <Trash2 size={12} />
                    </button>
                 </div>
                 <div className="absolute bottom-2 left-2">
                    <Badge className="bg-primary-indigo text-white border-none text-[8px] px-1.5 py-0.5">
                       {item.type.toUpperCase()}
                    </Badge>
                 </div>
              </div>
              <div className="p-4 space-y-4">
                 <h3 className="text-xs font-black italic line-clamp-2 leading-snug h-8">
                    {item.title}
                 </h3>
                 
                 <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {item.labels.map(l => (
                      <Badge key={l} variant="secondary" className="text-[8px] bg-slate-100 dark:bg-slate-800">{l}</Badge>
                    ))}
                    <button className="text-[10px] text-slate-400 hover:text-primary-indigo">
                       <Plus size={10} />
                    </button>
                 </div>

                 <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                    <Button variant="secondary" size="sm" className="flex-1 text-[10px] h-8 bg-slate-100 dark:bg-slate-900 border-none">
                       ANALYSIS
                    </Button>
                    <a 
                      href={`https://youtube.com/${item.type === 'channel' ? 'channel/' : 'watch?v='}${item.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 hover:bg-primary-indigo/10 rounded-lg text-slate-400 hover:text-primary-indigo transition-colors"
                    >
                       <ExternalLink size={14} />
                    </a>
                 </div>
              </div>
           </Card>
         ))}

         {filteredItems.length === 0 && (
            <div className="col-span-full py-20">
               <EmptyState 
                icon={activeTab === 'channels' ? User : Youtube}
                title={`No saved ${activeTab}`}
                description={`You haven't added any ${activeTab} to your watchlist for persistent surveillance yet.`}
                action={{
                  label: `BROWSE ${activeTab.toUpperCase()}`,
                  onClick: () => {}
                }}
               />
            </div>
         )}
      </div>
    </div>
  );
}
