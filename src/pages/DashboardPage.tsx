import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { 
  BarChart3, 
  Video, 
  Users, 
  Activity, 
  Zap, 
  ChevronRight,
  History,
  TrendingUp,
  Clock,
  ExternalLink,
  Search
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { theme, quotaUsed, activeKeyId } = useSettingsStore();
  const { items: history } = useHistoryStore();
  const { savedVideos = [], savedChannels = [] } = useWatchlistStore();
  const isDark = theme === 'dark';

  const kpis: any[] = [
    { label: 'Total Analyses', value: history.length, icon: Activity, color: 'text-indigo-600', trend: 'neutral' },
    { label: 'Saved Items', value: savedVideos.length + savedChannels.length, icon: Users, color: 'text-emerald-500', trend: 'neutral' },
    { label: 'Quota Used', value: `${Math.round((quotaUsed / 10000) * 100)}%`, icon: Zap, color: 'text-amber-500', trend: 'neutral', subtext: '/ 10k Limit' },
    { label: 'Engagement', value: '4.2%', icon: TrendingUp, color: 'text-rose-500', trend: 'up', trendPercent: '+12%' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header section with system status */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter italic">
            Intelligence <span className="text-indigo-600">Sync</span>
          </h1>
          <p className="font-medium italic text-slate-500">Real-time competitor surveillance and content performance logs.</p>
        </div>
        <div className="flex gap-3">
           <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-none px-4 py-2 font-black italic rounded-xl">
              2.4.0 CLOUD
           </Badge>
           <Badge className={cn(
             "border-none px-4 py-2 font-black italic rounded-xl h-fit",
             activeKeyId ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
           )}>
              {activeKeyId ? 'SYSTEMS ONLINE' : 'NODES OFFLINE'}
           </Badge>
        </div>
      </section>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard key={idx} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed: Recent Reports */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black italic flex items-center gap-2">
               <Clock size={20} className="text-indigo-600" />
               Recent Intelligence Reports
            </h3>
            <Link to="/history" className="text-xs font-black uppercase text-indigo-600 hover:opacity-80 flex items-center gap-1 group">
              Full Logs <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border-slate-100 dark:border-slate-800 shadow-xl">
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.length > 0 ? history.slice(0, 5).map((item) => (
                  <Link key={item.id + item.timestamp} to={item.type === 'video' ? `/video?url=${item.id}` : `/channel?id=${item.id}`} className="flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                     <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {item.type === 'video' ? <Video className="text-rose-500" /> : <Search className="text-indigo-600" />}
                     </div>
                     <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-none text-[8px] font-black uppercase px-2 h-4">
                              {item.type === 'video' ? 'VIDEO_AUDIT' : 'CHANNEL_MRI'}
                           </Badge>
                           <span className="text-[10px] font-black italic text-slate-400">
                              {format(new Date(item.timestamp), 'MMM dd | HH:mm')}
                           </span>
                        </div>
                        <p className="text-sm font-black italic line-clamp-1 text-slate-800 dark:text-slate-100">{item.title}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                           <p className="text-[10px] font-black uppercase text-slate-400">Score</p>
                           <p className="text-xs font-bold text-emerald-500">OPTIMAL</p>
                        </div>
                        <ChevronRight className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" size={20} />
                     </div>
                  </Link>
                )) : (
                  <div className="py-20 text-center">
                    <EmptyState 
                      icon={History}
                      title="No Reports Generated"
                      description="Initialize your first surveillance report by analyzing a video or channel."
                      action={{
                        label: 'START ANALYSIS',
                        onClick: () => {}
                      }}
                    />
                  </div>
                )}
             </div>
          </Card>
        </div>

        {/* Sidebar: System State & Quick Access */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-4">
              <h3 className="text-lg font-black italic">Rapid Launch</h3>
              <div className="grid grid-cols-1 gap-3">
                 <Link to="/analyzer" className="p-4 bg-indigo-600 rounded-3xl text-white group hover:shadow-lg shadow-indigo-600/20 transition-all border-none">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl"><Video size={18} /></div>
                          <span className="text-sm font-black italic">Video Audit</span>
                       </div>
                       <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </Link>
                 <Link to="/channel" className="p-4 bg-slate-900 rounded-3xl text-white group hover:shadow-lg shadow-slate-900/20 transition-all border-none">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl"><Activity size={18} /></div>
                          <span className="text-sm font-black italic">Channel MRI</span>
                       </div>
                       <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </Link>
                 <Link to="/preupload" className="p-4 bg-amber-500 rounded-3xl text-white group hover:shadow-lg shadow-amber-500/20 transition-all border-none">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl"><Zap size={18} /></div>
                          <span className="text-sm font-black italic">Optimizer</span>
                       </div>
                       <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </Link>
              </div>
           </div>

           <Card className="p-8 bg-slate-50 dark:bg-slate-900/50 border-none space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-black italic text-indigo-600 flex items-center gap-2">
                    <Users size={18} />
                    Watchlist
                 </h3>
                 <Badge variant="secondary" className="font-black italic">{savedVideos.length + savedChannels.length} ITEMS</Badge>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Total Competitors</span>
                    <span className="text-lg font-black italic">{savedChannels.length}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Viral References</span>
                    <span className="text-lg font-black italic">{savedVideos.length}</span>
                 </div>
              </div>
              <Link to="/watchlist" className="block text-center text-[10px] font-black uppercase text-indigo-600 hover:opacity-80">
                 Manage Surveillance List
              </Link>
           </Card>
        </div>
      </div>
    </div>
  );
}
