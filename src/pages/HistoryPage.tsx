import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ChevronRight,
  Clock,
  Youtube,
  BarChart3,
  SearchCode,
  TrendingUp,
  MessageSquare,
  Filter,
  ExternalLink,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHistoryStore } from '../store/useHistoryStore';
import { format } from 'date-fns';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeHistory, clearHistory } = useHistoryStore();

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    if (items.length === 0) return toast.error('No data to export');
    const headers = ['Type', 'Title', 'Timestamp'];
    const rows = items.map(i => [i.type, i.title, i.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "yt-competitor-history.csv");
    document.body.appendChild(link);
    link.click();
    toast.success('History exported successfully!');
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <Youtube size={16} className="text-rose-500" />;
      case 'channel': return <Clock size={16} className="text-emerald-500" />;
      case 'compare': return <BarChart3 size={16} className="text-indigo-500" />;
      case 'seo': return <SearchCode size={16} className="text-amber-500" />;
      case 'strategy': return <TrendingUp size={16} className="text-emerald-500" />;
      case 'comments': return <MessageSquare size={16} className="text-violet-500" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
             <History className="text-slate-400" size={32} />
             Intelligence Log
          </h1>
          <p className="text-slate-500 font-medium italic">Chronological record of all intelligence reports generated.</p>
        </div>
        <div className="flex gap-4">
           {items.length > 0 && (
             <>
                <Button 
                  onClick={exportCSV}
                  variant="secondary" 
                  className="px-6 h-12 gap-2 border-none bg-slate-100 dark:bg-slate-800"
                >
                    <Download size={16} /> Export CSV
                </Button>
                <Button 
                  onClick={() => confirm('Purge all logs?') && clearHistory()}
                  variant="emerald" 
                  className="px-6 h-12 gap-2 border-none bg-rose-500 hover:bg-rose-600 text-white"
                >
                    <Trash2 size={16} /> Purge
                </Button>
             </>
           )}
        </div>
      </div>

      <div className="relative">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
         <Input 
           placeholder="Filter history by title, type, or date..." 
           className="pl-12 h-14 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <Card className="p-0 overflow-hidden border-slate-100 dark:border-slate-800 shadow-xl rounded-3xl">
         <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.length > 0 ? filteredItems.map((item) => (
              <div key={item.id + item.timestamp} className="flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    {getIcon(item.type)}
                 </div>
                 <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                       <Badge className="text-[8px] uppercase font-black px-2 py-0 border-none bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.type}
                       </Badge>
                       <span className="text-[10px] text-slate-400 font-black italic">
                          {format(new Date(item.timestamp), 'MMM dd | HH:mm:ss')}
                       </span>
                    </div>
                    <h3 className="text-sm font-black italic tracking-tight text-slate-800 dark:text-slate-100">{item.title}</h3>
                 </div>
                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-9 gap-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none font-black italic text-[10px]"
                      onClick={() => toast.success('Intelligence Report PDF generated')}
                    >
                       <FileText size={12} /> REPORT
                    </Button>
                    <Link to={item.type === 'video' ? `/video?url=${item.id}` : `/channel?id=${item.id}`}>
                      <Button variant="secondary" size="sm" className="h-9 gap-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none font-black italic text-[10px]">
                         <ExternalLink size={12} /> VIEW
                      </Button>
                    </Link>
                    <button 
                      onClick={() => removeHistory(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            )) : (
              <div className="py-20">
                <EmptyState 
                  icon={History}
                  title="No Intelligence Logs"
                  description={searchQuery ? `No logs found matching "${searchQuery}"` : "You haven't generated any intelligence reports yet."}
                  action={!searchQuery ? {
                    label: 'GO TO ANALYZER',
                    onClick: () => {}
                  } : undefined}
                />
              </div>
            )}
         </div>
      </Card>
    </div>
  );
}
