import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  TrendingUp, 
  Sparkles, 
  Lightbulb, 
  Target, 
  Clock, 
  BarChart3,
  Calendar,
  Globe,
  Zap,
  ArrowRight,
  Flame,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../store/useSettingsStore';
import { useStrategyStore } from '../store/useStrategyStore';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function StrategyPage() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'gap' | 'themes'>('patterns');
  const [handle, setHandle] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const { theme, activeKeyId, apiKeys } = useSettingsStore();
  const { 
    patterns, 
    gaps, 
    themes, 
    loading, 
    analyzePatterns, 
    findGaps, 
    fetchThemes 
  } = useStrategyStore();
  const isDark = theme === 'dark';

  const apiKey = apiKeys.find(k => k.id === activeKeyId)?.key || '';

  const handleAnalyzePatterns = () => {
    if (!handle) return toast.error('Please enter a channel handle');
    analyzePatterns(handle, apiKey);
  };

  const handleFindGaps = () => {
    const validCompetitors = competitors.filter(c => c.trim() !== '');
    if (validCompetitors.length < 2) return toast.error('Check at least 2 competitors');
    findGaps(validCompetitors, apiKey);
  };

  const handleFetchThemes = () => {
    if (!handle) return toast.error('Please enter a channel handle');
    fetchThemes(handle, apiKey);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
             <TrendingUp className="text-emerald-500" size={32} />
             Content Strategy
          </h1>
          <p className="text-slate-500 font-medium italic">Data-backed blueprints for your next viral hit.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
           {(['patterns', 'gap', 'themes'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-lg" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
             >
               <span className="capitalize">{tab}</span>
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'patterns' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="patterns" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="p-8 lg:col-span-1 space-y-6">
                  <h3 className="text-lg font-black italic">Channel Pattern Analysis</h3>
                  <p className="text-xs text-slate-500">Analyze the last 50 uploads to identify frequency and timing streaks.</p>
                  <Input 
                    icon={Target}
                    placeholder="@Handle or ID..."
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                  />
                  <Button 
                    variant="emerald" 
                    className="w-full" 
                    onClick={handleAnalyzePatterns}
                    loading={loading}
                  >
                    Analyze Patterns
                  </Button>
                  
                  {patterns && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">Consistency Score</span>
                          <span className="text-emerald-500 font-black">{patterns.consistencyScore}/100</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">Current Streak</span>
                          <span className="text-indigo-600 font-black">{patterns.currentStreak} Weeks</span>
                       </div>
                    </div>
                  )}
               </Card>

               <Card className="p-8 lg:col-span-2">
                  <h3 className="text-xl font-black italic mb-8 flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-500" />
                    {patterns ? 'Upload Heatmap' : 'Analyze a channel to see heatmap'}
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                     {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
                       <div key={d} className="text-[10px] font-black text-center text-slate-400 py-2">{d}</div>
                     ))}
                     {patterns?.heatmapData?.flat().map((val: number, i: number) => (
                       <div key={i} className={cn(
                         "aspect-square rounded-lg border border-slate-50 dark:border-slate-800 flex items-center justify-center",
                         val > 3 ? "bg-emerald-500" : val > 1 ? "bg-emerald-500/30" : val > 0 ? "bg-emerald-500/10" : "bg-slate-50 dark:bg-slate-900/50"
                       )} />
                     )) || Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-slate-50 dark:bg-slate-900/50" />
                     ))}
                  </div>
                  {patterns && (
                    <div className="flex gap-4 mt-8">
                       <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Peak Day</p>
                          <p className="text-lg font-black italic">{patterns.peakDay}</p>
                       </div>
                       <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Peak Hour</p>
                          <p className="text-lg font-black italic">{patterns.peakHour}</p>
                       </div>
                    </div>
                  )}
               </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'gap' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="gap" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <Card className="p-8 space-y-6 lg:col-span-1">
                  <h3 className="text-lg font-black italic">Market Gap Finder</h3>
                  <div className="space-y-4">
                     {competitors.map((c, i) => (
                       <Input key={i} placeholder={`Competitor 0${i + 1}`} value={c} onChange={(e) => {
                          const newC = [...competitors];
                          newC[i] = e.target.value;
                          setCompetitors(newC);
                       }} />
                     ))}
                     <Button variant="secondary" size="sm" onClick={() => setCompetitors([...competitors, ''])} className="w-full text-[10px]">+ Add Competitor</Button>
                     <Button variant="emerald" className="w-full" onClick={handleFindGaps} loading={loading}>Find Gaps</Button>
                  </div>
               </Card>
               
               <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {gaps.map((gap) => (
                       <Card key={gap.id} className="p-6 border-l-4 border-emerald-500">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="text-lg font-black italic">{gap.title}</h4>
                             <Badge className="bg-emerald-500 text-white border-none">{gap.opportunityScore}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 italic mb-4">{gap.reason}</p>
                          <Button variant="secondary" size="sm" className="h-8 text-[10px]">SAVE AS IDEA</Button>
                       </Card>
                     ))}
                     {gaps.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center text-slate-400 italic">
                           Enter competitors to find opportunities.
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'themes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="themes" className="space-y-8">
             <div className="max-w-2xl mx-auto flex gap-4">
                <Input placeholder="Enter channel handle for theme analysis..." value={handle} onChange={(e) => setHandle(e.target.value)} />
                <Button variant="emerald" onClick={handleFetchThemes} loading={loading}>Analyze Themes</Button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                   <h3 className="text-xl font-black italic mb-8">Topic Theme Performance</h3>
                   <div className="space-y-6">
                      {themes.map(theme => (
                        <ThemeRow 
                          key={theme.id} 
                          label={theme.name} 
                          views={theme.avgViews.toLocaleString()} 
                          engagement={`${theme.engagement}%`} 
                          color={theme.id === '1' ? 'bg-indigo-600' : theme.id === '2' ? 'bg-emerald-500' : 'bg-amber-500'} 
                        />
                      ))}
                      {themes.length === 0 && !loading && <p className="text-center text-slate-400 italic py-10">No theme data available.</p>}
                   </div>
                </Card>
                
                <Card className="p-8 space-y-6">
                   <h3 className="text-xl font-black italic">Best Video Per Cluster</h3>
                   <div className="space-y-4">
                      {themes.map(theme => (
                        <div key={theme.id} className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                           <div className="w-20 aspect-video rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                           <div className="space-y-1">
                              <h5 className="text-[11px] font-black italic leading-tight">{theme.examples[0]}</h5>
                              <p className="text-[10px] text-emerald-500 font-bold uppercase">{theme.name} Cluster</p>
                           </div>
                        </div>
                      ))}
                      {themes.length === 0 && !loading && <p className="text-center text-slate-400 italic py-10">No theme data available.</p>}
                   </div>
                </Card>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeRow({ label, views, engagement, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
         <span>{label}</span>
         <span className="flex gap-4">
           <span>{views} Views</span>
           <span className="text-emerald-500">{engagement} Eng.</span>
         </span>
       </div>
       <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full", color)} style={{ width: `${Math.random() * 50 + 40}%` }} />
       </div>
    </div>
  );
}


function PredictionItem({ label, value, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
         <span className="text-slate-400">{label}</span>
         <span>{value}</span>
       </div>
       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className={cn("h-full", color)} style={{ width: value.includes('%') ? value : '40%' }} />
       </div>
    </div>
  );
}

function PostingTime({ day, time, score }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
       <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase italic text-emerald-500">{day}</p>
          <p className="text-xs font-bold">{time}</p>
       </div>
       <div className="text-xl font-black italic text-slate-200">{score}</div>
    </div>
  );
}

function VideoPreviewIcon() {
  return (
    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 p-2 rounded-lg -top-12 z-20 whitespace-nowrap">
       <span className="text-[8px] font-black uppercase">Live Stream Scheduled</span>
    </div>
  );
}
