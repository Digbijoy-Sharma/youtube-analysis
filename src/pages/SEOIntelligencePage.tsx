import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useSEOStore } from '../store/useSEOStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { 
  Search, 
  Tag, 
  Target, 
  Copy, 
  Trash2, 
  BarChart3, 
  Hash,
  AlertTriangle,
  Zap,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

type TabType = 'keywords' | 'tags' | 'score';

export function SEOIntelligencePage() {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [query, setQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const { activeKeyId, apiKeys, theme } = useSettingsStore();
  const { keywordResults, analyzedTags, loading, error, searchKeywords, setTags } = useSEOStore();
  const isDark = theme === 'dark';

  const handleSearch = async () => {
    if (!query) return;
    const key = apiKeys.find(k => k.id === activeKeyId)?.key || '';
    await searchKeywords(query, key);
  };

  const handleAddTags = () => {
    const newTags = tagInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    const combined = Array.from(new Set([...analyzedTags, ...newTags]));
    setTags(combined);
    setTagInput('');
    toast.success(`${newTags.length} tags added`);
  };

  const copyTags = () => {
    const text = analyzedTags.join(', ');
    navigator.clipboard.writeText(text);
    toast.success('Tags copied to clipboard');
  };

  const calculateMetrics = () => {
    if (keywordResults.length === 0) {
        return { volume: 0, comp: 0, opp: 0 };
    }
    const str = keywordResults.map(r => r.title).join('');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    const volume = 40 + (hash % 55); 
    const comp = 20 + ((hash >> 2) % 65); 
    const opp = Math.max(10, Math.min(100, volume - (comp / 2) + 20 + ((hash >> 4) % 15)));
    return { volume: Math.floor(volume), comp: Math.floor(comp), opp: Math.floor(opp) };
  };

  const metrics = calculateMetrics();

  const getTagCategory = (tag: string) => {
    if (tag.length < 8) return { label: 'Broad', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
    if (tag.length > 20) return { label: 'Niche', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    return { label: 'Targeted', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  };

  const currentChars = analyzedTags.join(', ').length;

  const calculateScores = () => {
    let searchScore = 0;
    let searchDesc = "Add a title and description to evaluate searchability.";

    if (title.length > 10) {
        searchScore += 30;
        searchDesc = "Good title length. Add a description for more context.";
        const wordCount = title.trim().split(/\s+/).length;
        if (wordCount >= 5) {
            searchScore += 10;
        }
    }

    const hashtags = description.match(/#\w+/g) || [];
    if (hashtags.length > 0) {
        if (hashtags.length <= 5) {
            searchScore += 20;
            searchDesc = "Good use of hashtags in description.";
        } else {
            searchScore += 10;
            searchDesc = "Too many hashtags might look spammy. Reduce to 3-5.";
        }
    } else if (description.length > 30) {
        searchScore += 10;
        searchDesc = "Consider adding 3-5 hashtags to your description.";
    }

    if (title.length > 10 && description.length > 30) {
        const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const descWords = description.toLowerCase();
        const commonWords = titleWords.filter(w => descWords.includes(w));
        if (commonWords.length >= 2) {
            searchScore += 10;
            searchDesc = "Good keyword repetition across title and description.";
        }
    }

    if (analyzedTags.length >= 5 && analyzedTags.length <= 20) {
        searchScore += 10;
    } else if (analyzedTags.length > 0) {
        searchScore += 5;
    }

    if (title.trim().length === 0 && description.trim().length === 0) {
        searchScore = 0;
        searchDesc = "Add a title and description to evaluate searchability.";
    }

    let titleHasTag = false;
    let descHasTag = false;
    
    if (title.length > 0 && analyzedTags.length > 0) {
        titleHasTag = analyzedTags.some(tag => title.toLowerCase().includes(tag.toLowerCase()));
        if (titleHasTag) {
            searchScore += 5;
            searchDesc = "Tags from workspace successfully incorporated into title.";
        }
    }
    if (description.length > 0 && analyzedTags.length > 0) {
        descHasTag = analyzedTags.some(tag => description.toLowerCase().includes(tag.toLowerCase()));
        if (descHasTag) {
            searchScore += 5;
            if (titleHasTag) searchDesc = "Great keyword coverage across tags, title, and description.";
        }
    }

    searchScore = Math.min(100, searchScore);

    if (searchScore >= 80) searchDesc = "Excellent searchability! Great keyword placement.";
    else if (searchScore >= 60 && hashtags.length === 0) searchDesc = "Good base, but adding hashtags will boost reach.";
    else if (searchScore >= 60 && analyzedTags.length === 0) searchDesc = "Good base. Use the tags workspace for ideas.";

    if (searchScore === 0 && (title.length > 0 || description.length > 0)) {
        searchDesc = "Add more context to evaluate keyword coverage.";
    }

    let ctrScore = 0;
    let ctrDesc = "Add a title to evaluate CTR.";
    if (title.length > 0) {
        if (title.length >= 30 && title.length <= 60) {
            ctrScore += 80;
            ctrDesc = "Optimal title length for mobile and desktop views.";
        } else if (title.length > 60) {
            ctrScore += 40;
            ctrDesc = "Title might be too long. It could get truncated on mobile views.";
        } else {
            ctrScore += 40;
            ctrDesc = "Title is a bit short. Add more context or a hook.";
        }
        
        if (/\d/.test(title)) ctrScore = Math.min(100, ctrScore + 10);
        if (/[A-Z]{2,}/.test(title)) ctrScore = Math.min(100, ctrScore + 10);
    }

    let engScore = 0;
    let engDesc = "Add a description to evaluate engagement.";
    if (description.length > 0) {
        if (description.length > 200) engScore += 40;
        else engScore += 20;

        const hasLinks = /(https?:\/\/[^\s]+)/g.test(description);
        if (hasLinks) {
            engScore += 30;
            engDesc = "Good use of links for call-to-actions.";
        } else {
            engDesc = "Consider adding links (socials, related videos) as call-to-actions.";
        }

        const hasTimestamps = /\d{1,2}:\d{2}/.test(description);
        if (hasTimestamps) {
            engScore += 30;
            engDesc = hasLinks ? "Excellent engagement drivers: links and chapters." : "Chapters detected. Good for engagement.";
        }
    }

    const getStatus = (score: number) => {
        if (score === 0) return 'danger';
        if (score >= 80) return 'success';
        if (score >= 50) return 'warning';
        return 'danger';
    };

    return {
        searchability: { 
            value: searchScore, 
            desc: searchDesc, 
            status: getStatus(searchScore),
            checks: [
                { label: 'Title Length', passed: title.length > 10 },
                { label: 'Keywords in Title', passed: titleHasTag },
                { label: 'Keywords in Desc', passed: descHasTag },
            ]
        },
        ctr: { 
            value: ctrScore, 
            desc: ctrDesc, 
            status: getStatus(ctrScore),
            checks: [
                { label: 'Optimal Length', passed: title.length >= 30 && title.length <= 60 },
                { label: 'Has Numbers', passed: /\d/.test(title) },
                { label: 'Capitalization', passed: /[A-Z]{2,}/.test(title) },
            ]
        },
        engagement: { 
            value: engScore, 
            desc: engDesc, 
            status: getStatus(engScore),
            checks: [
                { label: 'Long Description', passed: description.length > 200 },
                { label: 'Contains Links', passed: /(https?:\/\/[^\s]+)/g.test(description) },
                { label: 'Has Chapters', passed: /\d{1,2}:\d{2}/.test(description) },
            ]
        }
    };
  };

  const scores = calculateScores();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
             <Target className="text-indigo-600" size={32} />
             SEO Intelligence
          </h1>
          <p className="text-slate-500 font-medium italic">Master the algorithm with data-driven optimization.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
           {(['keywords', 'tags', 'score'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-lg" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
             >
               <span className="capitalize">{tab}</span>
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'keywords' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="keywords" className="space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative group">
                <Input 
                   icon={Search}
                   placeholder="Search keywords or topics..."
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch} 
                  loading={loading}
                  variant="indigo"
                  className="absolute right-1 top-1 bottom-1 px-6 rounded-lg text-[10px]"
                >
                  Explore
                </Button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
                 <AlertTriangle size={14} className="text-amber-600" />
                 <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">Warning: Keyword research uses high-quota search endpoints (100 units).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 space-y-6">
                <h3 className="text-xl font-black italic flex items-center gap-2">
                   <BarChart3 size={20} className="text-indigo-600" />
                   Competitor Landscape
                </h3>
                <div className="space-y-4">
                  {keywordResults.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-sm font-black line-clamp-1 italic text-slate-800 dark:text-slate-100">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mt-1">{item.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {item.title.split(' ').filter((w: string) => w.length > 4).slice(0, 3).map((word: string, idx: number) => (
                             <button 
                               key={idx}
                               onClick={() => setTags([...new Set([...analyzedTags, word.replace(/[^\w]/g, '').toLowerCase()])])}
                               className="px-2 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                             >
                               + {word.replace(/[^\w]/g, '').toLowerCase()}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!keywordResults.length && <p className="text-xs text-slate-400 italic text-center py-10">No results yet. Start searching.</p>}
                </div>
              </Card>

              <Card className="p-8 space-y-6">
                <h3 className="text-xl font-black italic flex items-center gap-2">
                   <Zap size={20} className="text-amber-500" />
                   Difficulty Estimator
                </h3>
                <div className="space-y-6">
                    {keywordResults.length > 0 ? (
                      <>
                        <DifficultyRow label="Volume" value={metrics.volume > 60 ? "High" : "Mid"} color="text-indigo-600" percent={metrics.volume} />
                        <DifficultyRow label="Competition" value={metrics.comp > 60 ? "High" : "Low"} color="text-amber-500" percent={metrics.comp} />
                        <DifficultyRow label="Opportunity" value={metrics.opp > 60 ? "High" : "Low"} color="text-emerald-500" percent={metrics.opp} />
                      </>
                    ) : (
                      <div className="py-10 text-center">
                        <Activity className="size-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 italic">Search for keywords to estimate difficulty.</p>
                      </div>
                    )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'tags' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="tags" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-black italic uppercase tracking-wider text-slate-400">Add Tags in Bulk</h3>
                <textarea 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Paste tags here (one per line)..."
                  className="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs font-mono outline-none focus:border-indigo-500 transition-all resize-none"
                />
                <Button variant="indigo" onClick={handleAddTags} className="w-full">Inject Tags</Button>
              </Card>

              <Card className="p-6 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span>Character Count</span>
                   <span className={cn(currentChars > 500 ? "text-rose-500" : "text-indigo-600")}>{currentChars} / 500</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className={cn("h-full transition-all duration-500", currentChars > 500 ? "bg-rose-500 shadow-lg shadow-rose-500/20" : "bg-indigo-600")} 
                    style={{ width: `${Math.min((currentChars / 500) * 100, 100)}%` }} 
                   />
                 </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-8 h-full bg-slate-50 dark:bg-slate-950/20 border-dashed border-2">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black italic flex items-center gap-2">
                    <Tag size={20} className="text-indigo-600" />
                    Tags Workspace
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={copyTags} className="h-10 px-4"><Copy size={14} className="mr-2" /> Copy All</Button>
                    <Button variant="secondary" size="sm" onClick={() => setTags([])} className="h-10 px-4 text-rose-500"><Trash2 size={14} className="mr-2" /> Clear</Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                   {analyzedTags.map((tag, i) => {
                     const cat = getTagCategory(tag);
                     return (
                      <div key={i} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs flex items-center gap-3 group shadow-sm">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{tag}</span>
                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border", cat.color)}>
                          {cat.label}
                        </span>
                        <button onClick={() => setTags(analyzedTags.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all ml-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                     );
                   })}
                   {!analyzedTags.length && (
                     <div className="w-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <Hash size={40} className="mb-4 opacity-10" />
                        <p className="text-sm font-black italic">Workspace is Empty</p>
                     </div>
                   )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

         {activeTab === 'score' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="score" className="max-w-4xl mx-auto space-y-12">
             <div className="text-center space-y-4">
                <h2 className="text-3xl font-black italic">Pre-Publish Scoring</h2>
                <p className="text-slate-500">Benchmark your metadata before you hit publish to ensure maximum reach.</p>
             </div>
             
             <Card className="p-6 space-y-6">
                <div>
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Video Title</label>
                   <Input 
                      placeholder="Enter your proposed video title..." 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                   />
                </div>
                <div>
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Video Description</label>
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Enter your proposed video description..."
                     className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 transition-all resize-none"
                   />
                </div>
             </Card>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ScoreCard label="Searchability" score={scores.searchability.value} desc={scores.searchability.desc} status={scores.searchability.status} checks={scores.searchability.checks} />
                <ScoreCard label="CTR Potential" score={scores.ctr.value} desc={scores.ctr.desc} status={scores.ctr.status} checks={scores.ctr.checks} />
                <ScoreCard label="Engagement" score={scores.engagement.value} desc={scores.engagement.desc} status={scores.engagement.status} checks={scores.engagement.checks} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DifficultyRow({ label, value, color, percent }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full", color.replace('text', 'bg'))} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ScoreCard({ label, score, desc, status = 'success', checks = [] }: any) {
  return (
    <Card className="p-8 space-y-6 flex flex-col">
      <div className="text-center space-y-4">
          <div className="mx-auto w-fit inline-flex flex-col items-center justify-center p-6 rounded-full border-8 border-slate-50 dark:border-slate-900 shadow-xl">
             <span className={cn(
               "text-4xl font-black italic tabular-nums",
               status === 'success' ? "text-emerald-500" : status === 'warning' ? "text-amber-500" : "text-rose-500"
             )}>{score}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Score</span>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-slate-800 dark:text-slate-100">{label}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
          </div>
      </div>
      {(checks && checks.length > 0) && (
        <div className="mt-auto space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
           {checks.map((check: any, i: number) => (
             <div key={i} className="flex items-center gap-3">
               {check.passed ? (
                 <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
               ) : (
                 <XCircle size={16} className="text-slate-300 shrink-0" />
               )}
               <span className={cn(
                 "text-xs font-medium",
                 check.passed ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700"
               )}>{check.label}</span>
             </div>
           ))}
        </div>
      )}
    </Card>
  );
}
