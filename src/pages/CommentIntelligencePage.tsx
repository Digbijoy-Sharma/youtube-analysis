import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useCommentStore } from '../store/useCommentStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { 
  MessageSquare, 
  Search, 
  BarChart2, 
  PieChart, 
  HelpCircle, 
  Smile, 
  Cloud,
  FileText,
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { extractVideoId, formatDate } from '../utils/formatters';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export function CommentIntelligencePage() {
  const [url, setUrl] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const { activeKeyId, apiKeys, theme } = useSettingsStore();
  const { analysis, loading, error, analyzeComments } = useCommentStore();
  const isDark = theme === 'dark';

  const handleAnalyze = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) return;
    const key = apiKeys.find(k => k.id === activeKeyId)?.key || '';
    await analyzeComments(videoId, key);
  };

  const sentimentData = analysis ? [
    { name: 'Positive', value: analysis.sentiment.positive, color: '#10b981' },
    { name: 'Neutral', value: analysis.sentiment.neutral, color: '#6366f1' },
    { name: 'Negative', value: analysis.sentiment.negative, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-8 pb-20">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight italic flex items-center justify-center gap-3">
          <MessageSquare className="text-indigo-600" size={32} />
          Comment Intelligence
        </h1>
        <p className="text-slate-500 font-medium italic">Mine the gold in the comment section. Understand user sentiment & intent.</p>
        
        <div className="relative group mt-8">
          <Input 
            icon={Search}
            placeholder="Paste video URL to fetch comments..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Button 
            onClick={handleAnalyze} 
            loading={loading}
            variant="indigo"
            className="absolute right-1 top-1 bottom-1 px-8 rounded-lg text-xs"
          >
            Fetch
          </Button>
        </div>
        {error && <p className="text-[10px] font-bold text-rose-500 uppercase mt-2">{error}</p>}
      </div>

      <AnimatePresence mode="wait">
        {analysis && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sentiment & Overview */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="p-8 text-center space-y-6">
                   <h3 className="text-xl font-black italic flex items-center justify-center gap-2">
                     <Smile size={20} className="text-emerald-500" />
                     Sentiment Vibe
                   </h3>
                   <div className="h-[240px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {sentimentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none' }}
                             itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          />
                        </RePieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-6">
                      {sentimentData.map(d => (
                        <div key={d.name} className="flex flex-col items-center gap-1">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{d.name}</span>
                           <span className="text-sm font-black italic" style={{ color: d.color }}>{d.value}%</span>
                        </div>
                      ))}
                   </div>
                </Card>

                <Card className="p-8 space-y-6">
                   <h3 className="text-xl font-black italic flex items-center gap-2">
                     <Cloud size={20} className="text-indigo-600" />
                     Word Cloud Highlights
                   </h3>
                   <div className="flex flex-wrap gap-2 justify-center">
                      {analysis.topWords.map((word: any, i: number) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-indigo-600"
                          style={{ fontSize: 10 + (word.value / 2) }}
                        >
                          {word.text}
                        </span>
                      ))}
                   </div>
                </Card>
              </div>

              {/* In-depth Analysis */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 space-y-6 border-indigo-600/10">
                       <h3 className="text-xl font-black italic flex items-center gap-2">
                         <HelpCircle size={20} className="text-indigo-600" />
                         Common Questions
                       </h3>
                       <div className="space-y-4">
                          {analysis.questions.map((q: string, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-xs font-medium italic border-l-4 border-indigo-600 text-slate-600 dark:text-slate-300">
                              "{q}"
                            </div>
                          ))}
                          {!analysis.questions.length && <p className="text-xs text-slate-400 italic">No significant questions found.</p>}
                       </div>
                    </Card>

                    <Card className="p-8 space-y-6 border-emerald-600/10">
                       <h3 className="text-xl font-black italic flex items-center gap-2">
                         <BarChart2 size={20} className="text-emerald-500" />
                         Themes & Intent
                       </h3>
                       <div className="h-[250px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.topWords.slice(0, 8)}>
                              <XAxis dataKey="text" hide />
                              <YAxis hide />
                              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                         </ResponsiveContainer>
                       </div>
                       <div className="space-y-3">
                          <IntentItem label="Informational/Learning" percent={65} color="bg-indigo-600" />
                          <IntentItem label="Gratitude/Support" percent={25} color="bg-emerald-500" />
                          <IntentItem label="Critical/Correction" percent={10} color="bg-rose-500" />
                       </div>
                    </Card>
                 </div>

                 <Card className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black italic flex items-center gap-2">
                        <FileText size={20} className="text-slate-400" />
                        Raw Analysis Feed
                       </h3>
                       <Input 
                        placeholder="Filter comments..." 
                        className="max-w-xs h-10 text-xs" 
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                       />
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                       {analysis.threads.map((thread: any, i: number) => {
                         const comment = thread.snippet.topLevelComment.snippet;
                         if (filterQuery && !comment.textDisplay.toLowerCase().includes(filterQuery.toLowerCase())) return null;
                         return (
                           <div key={i} className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all">
                              <div className="flex items-center gap-3 mb-2">
                                 <img src={comment.authorProfileImageUrl} className="w-8 h-8 rounded-full border-2 border-indigo-100 dark:border-indigo-900/30" />
                                 <div className="space-y-0.5">
                                    <h5 className="text-xs font-black italic">{comment.authorDisplayName}</h5>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(comment.publishedAt)}</span>
                                 </div>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-11" dangerouslySetInnerHTML={{ __html: comment.textDisplay }} />
                           </div>
                         );
                       })}
                    </div>
                 </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IntentItem({ label, percent, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
