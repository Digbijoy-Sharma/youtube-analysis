import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeftRight, 
  Video, 
  Users, 
  Plus, 
  Trash2, 
  Award,
  TrendingUp,
  Eye,
  ThumbsUp,
  Target,
  BarChart3,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCompareStore } from '../store/useCompareStore';
import { formatNumber, formatDate, extractChannelId } from '../utils/formatters';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';

export function ComparePage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'channels'>('videos');
  const [urls, setUrls] = useState(['', '']);
  const { activeKeyId, apiKeys, theme } = useSettingsStore();
  const { videos, channels, loading, error, compareVideos, compareChannels } = useCompareStore();
  const isDark = theme === 'dark';

  const maxItems = activeTab === 'videos' ? 5 : 3;

  const addItem = () => {
    if (urls.length < maxItems) {
      setUrls([...urls, '']);
    } else {
      toast.error(`Maximum ${maxItems} items can be compared at once.`);
    }
  };

  const removeItem = (index: number) => {
    if (urls.length <= 2) {
      toast.error('At least 2 items are required for comparison.');
      return;
    }
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  // Tag overlap logic
  const getCommonTags = () => {
    if (activeTab !== 'videos' || videos.length < 2) return [];
    const allTagLists = videos.map(v => v.snippet.tags || []);
    if (allTagLists.some(list => list.length === 0)) return [];
    
    return allTagLists.reduce((common, list) => 
      common.filter(tag => list.includes(tag))
    );
  };

  // SEO Radar data
  const getRadarData = () => {
    const metrics = ['SEO Score', 'Engagement', 'Retention', 'Growth', 'Consistency'];
    return metrics.map(m => {
      const obj: any = { subject: m };
      const items = activeTab === 'videos' ? videos : channels;
      items.forEach((item, i) => {
        obj[`Player ${i + 1}`] = Math.floor(Math.random() * 40) + 60; // Mock scores for radar visualization
      });
      return obj;
    });
  };

  const commonTags = getCommonTags();
  const radarData = getRadarData();

  const handleCompare = async () => {
    const key = apiKeys.find(k => k.id === activeKeyId)?.key || '';
    if (!key) {
      toast.error('API Key required. Check settings.');
      return;
    }

    if (urls.some(url => !url.trim())) {
      toast.error('Please fill all input fields.');
      return;
    }

    if (activeTab === 'videos') {
      await compareVideos(urls, key);
    } else {
      const channelIds = urls.map(url => extractChannelId(url) || url);
      await compareChannels(channelIds, key);
    }
  };

  const getWinnerIdx = (values: (number | string)[], mode: 'high' | 'low' = 'high') => {
    if (!values || values.length === 0) return -1;
    const nums = values.map(v => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      return parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
    });
    
    let bestVal = mode === 'high' ? -Infinity : Infinity;
    let bestIdx = -1;
    
    nums.forEach((val, idx) => {
      if (mode === 'high' ? val > bestVal : val < bestVal) {
        bestVal = val;
        bestIdx = idx;
      }
    });
    
    return bestIdx;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
             <ArrowLeftRight className="text-indigo-600" size={32} />
             Battle Hub
          </h1>
          <p className="text-slate-500 font-medium italic">Benchmark metrics side-by-side to find the ultimate winner.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
           {(['videos', 'channels'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setUrls(['', '']);
                }}
                className={cn(
                  "flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-lg" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
             >
               {tab === 'videos' ? <Video size={14} /> : <Users size={14} />}
               <span className="capitalize">{tab}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black italic uppercase tracking-wider text-slate-400">Target Selection</h3>
                <button 
                  onClick={addItem}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:scale-110 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {urls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">0{idx + 1}</div>
                    <input 
                       type="text" 
                       value={url}
                       onChange={(e) => {
                         const newUrls = [...urls];
                         newUrls[idx] = e.target.value;
                         setUrls(newUrls);
                       }}
                       placeholder={activeTab === 'videos' ? "Video URL..." : "@Handle or ID..."}
                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-10 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                    />
                    {urls.length > 2 && (
                      <button 
                        onClick={() => removeItem(idx)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                         <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleCompare} 
                loading={loading}
                variant="indigo"
                className="w-full py-6 rounded-2xl font-black italic uppercase tracking-widest text-xs"
              >
                Launch Analysis
              </Button>
              {error && <p className="text-[10px] font-bold text-rose-500 uppercase text-center mt-2">{error}</p>}
            </div>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!loading && !videos.length && !channels.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="empty"
                className="py-12"
              >
                <EmptyState 
                  icon={ArrowLeftRight}
                  title="Comparison Matrix Offline"
                  description={`Add up to ${maxItems} ${activeTab} URLs above to perform side-by-side performance benchmarking and keyword overlap analysis.`}
                />
              </motion.div>
            ) : loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key="results"
                className="space-y-8"
              >
                {/* Comparison Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {(activeTab === 'videos' ? videos : channels).map((item, idx) => (
                    <Card key={idx} className="p-3 overflow-hidden group border-2 border-transparent hover:border-indigo-600/20">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <img 
                          src={activeTab === 'videos' ? item.snippet.thumbnails.medium.url : item.snippet.thumbnails.high.url} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt="Thumbnail"
                        />
                         <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 rounded text-[8px] font-black italic text-white uppercase">Player 0{idx + 1}</div>
                      </div>
                      <h4 className="font-black text-[11px] italic line-clamp-2 min-h-[2rem] leading-tight">
                        {item.snippet.title}
                      </h4>
                    </Card>
                  ))}
                </div>

                {/* Advanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <Card className="p-8">
                      <h3 className="text-xl font-black italic mb-8 flex items-center gap-2">
                        <Zap size={20} className="text-amber-500" />
                        Performance Radar
                      </h3>
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                              <PolarRadiusAxis hide />
                              {(activeTab === 'videos' ? videos : channels).map((_, i) => (
                                <Radar
                                  key={i}
                                  name={`Player ${i + 1}`}
                                  dataKey={`Player ${i + 1}`}
                                  stroke={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]}
                                  fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]}
                                  fillOpacity={0.2}
                                />
                              ))}
                              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none' }} />
                           </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </Card>

                   <Card className="p-8 space-y-6">
                      <h3 className="text-xl font-black italic flex items-center gap-2">
                        <Layers size={20} className="text-indigo-600" />
                        Common Tag overlap
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {commonTags.length > 0 ? commonTags.map((tag, i) => (
                           <Badge key={i} variant="indigo" className="py-1.5 px-4 rounded-xl text-[10px] uppercase font-black tracking-tight">{tag}</Badge>
                         )) : (
                           <div className="w-full h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                              <p className="text-sm font-black italic">No Overlapping Tags Found</p>
                              <span className="text-[10px] uppercase mt-1">Unique strategies detected</span>
                           </div>
                         )}
                      </div>
                   </Card>
                </div>

                {/* Metric Table */}
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-48">Metric Battle</th>
                          {(activeTab === 'videos' ? videos : channels).map((_, i) => (
                            <th key={i} className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-indigo-600">Player 0{i + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeTab === 'videos' ? (
                          <>
                            <ComparisonRow 
                              label="Views" 
                              icon={Eye} 
                              values={videos.map(v => formatNumber(v.statistics.viewCount))} 
                              winnerIdx={getWinnerIdx(videos.map(v => v.statistics.viewCount))} 
                            />
                            <ComparisonRow 
                              label="Likes" 
                              icon={ThumbsUp} 
                              values={videos.map(v => formatNumber(v.statistics.likeCount))} 
                              winnerIdx={getWinnerIdx(videos.map(v => v.statistics.likeCount))} 
                            />
                            <ComparisonRow 
                              label="Engagement" 
                              icon={TrendingUp} 
                              values={videos.map(v => `${v.engagementRate}%`)} 
                              winnerIdx={getWinnerIdx(videos.map(v => v.engagementRate))} 
                            />
                            <ComparisonRow 
                              label="Published" 
                              icon={Calendar} 
                              values={videos.map(v => formatDate(v.snippet.publishedAt))} 
                              winnerIdx={getWinnerIdx(videos.map(v => new Date(v.snippet.publishedAt).getTime()), 'high')}
                            />
                            <ComparisonRow 
                              label="SEO Score" 
                              icon={Target} 
                              values={videos.map(v => `${v.seoScore || 0}/100`)} 
                              winnerIdx={getWinnerIdx(videos.map(v => v.seoScore || 0))} 
                            />
                          </>
                        ) : (
                          <>
                            <ComparisonRow 
                              label="Subscribers" 
                              icon={Users} 
                              values={channels.map(c => formatNumber(c.statistics.subscriberCount))} 
                              winnerIdx={getWinnerIdx(channels.map(c => c.statistics.subscriberCount))} 
                            />
                            <ComparisonRow 
                              label="Total Views" 
                              icon={BarChart3} 
                              values={channels.map(c => formatNumber(c.statistics.viewCount))} 
                              winnerIdx={getWinnerIdx(channels.map(c => c.statistics.viewCount))} 
                            />
                            <ComparisonRow 
                              label="Uploads" 
                              icon={Video} 
                              values={channels.map(c => formatNumber(c.statistics.videoCount))} 
                              winnerIdx={getWinnerIdx(channels.map(c => c.statistics.videoCount))} 
                            />
                            <ComparisonRow 
                              label="Joined" 
                              icon={Calendar} 
                              values={channels.map(c => formatDate(c.snippet.publishedAt))} 
                              winnerIdx={getWinnerIdx(channels.map(c => new Date(c.snippet.publishedAt).getTime()), 'low')} 
                            />
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, icon: Icon, values, winnerIdx }: { label: string, icon: any, values: string[], winnerIdx: number }) {
  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600 transition-colors">
            <Icon size={16} />
          </div>
          <span className="text-xs font-black italic uppercase tracking-wider text-slate-500">{label}</span>
        </div>
      </td>
      {values.map((val, idx) => (
        <td key={idx} className={cn(
          "p-6 text-center text-sm font-black tabular-nums transition-all",
          winnerIdx === idx ? "text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/5 shadow-inner" : "text-slate-600 dark:text-slate-400"
        )}>
          <div className="flex items-center justify-center gap-2">
            {val}
            {winnerIdx === idx && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Award size={14} className="text-indigo-600" />
              </motion.div>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}
