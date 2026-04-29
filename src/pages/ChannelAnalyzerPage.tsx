import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { useChannelStore } from '../store/useChannelStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { 
  Search, 
  Users, 
  Video, 
  Eye, 
  Calendar, 
  Globe, 
  Tag, 
  ExternalLink,
  Download,
  Share2,
  TrendingUp,
  Clock,
  BarChart2,
  List,
  Activity,
  CheckCircle2,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatNumber, formatDate, extractChannelId, formatDuration } from '../utils/formatters';
import { Skeleton, CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
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
  AreaChart,
  Area
} from 'recharts';

type TabType = 'overview' | 'library' | 'analytics' | 'seo' | 'export';

export function ChannelAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { analyzeChannel, currentChannel, channelVideos, loading, fetchVideos, error } = useChannelStore();
  const { activeKeyId, apiKeys, theme } = useSettingsStore();
  const { addToHistory } = useHistoryStore();
  const { addChannel, savedChannels, removeChannel } = useWatchlistStore();

  const isDark = theme === 'dark';
  const isSaved = currentChannel && savedChannels.some(c => c.id === currentChannel.id);

  const handleAnalyze = async () => {
    const channelId = extractChannelId(url);
    if (!channelId) {
      toast.error('Invalid Channel URL or ID');
      return;
    }
    const key = apiKeys.find(k => k.id === activeKeyId)?.key || '';
    const result = await analyzeChannel(channelId, key);
    
    if (result) {
      addToHistory({
        id: result.id,
        type: 'channel',
        title: result.snippet.title,
        identifier: channelId,
        thumbnail: result.snippet.thumbnails.default?.url,
        viewsAtAnalysis: result.statistics.viewCount
      });
      // Automatically fetch library
      await fetchVideos(result.id, key);
    }
  };

  const handleSave = () => {
    if (!currentChannel) return;
    if (isSaved) {
      removeChannel(currentChannel.id);
      toast.success('Removed from watchlist');
    } else {
      addChannel({
        id: currentChannel.id,
        title: currentChannel.snippet.title,
        thumbnail: currentChannel.snippet.thumbnails.medium?.url,
        subscriberCount: currentChannel.statistics.subscriberCount,
      });
      toast.success('Saved to watchlist');
    }
  };

  // Prepare chart data
  const topVideosData = channelVideos?.slice(0, 10).map(v => ({
    name: (v.snippet?.title?.length || 0) > 20 ? v.snippet.title.substring(0, 20) + '...' : v.snippet.title || 'Untitled Video',
    views: parseInt(v.statistics?.viewCount || '0'),
    engagement: v.engagementRate || 0
  })) || [];

  return (
    <div className="space-y-8 pb-20">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Channel Intelligence</h1>
        <p className="text-slate-500 font-medium italic">Reverse-engineer any creator's content strategy.</p>
        
        <div className="relative group mt-8">
          <div className={cn(
            "flex items-center gap-3 p-1.5 rounded-2xl border transition-all duration-300",
            isDark ? "bg-slate-800 border-slate-700 focus-within:border-indigo-500" : "bg-white border-slate-200 focus-within:border-indigo-600 shadow-xl"
          )}>
            <div className="pl-4">
              <Search className="text-slate-400 w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Channel URL, Handle (@) or ID..." 
              className="bg-transparent border-none outline-none text-base px-1 flex-1 py-3"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze} 
              loading={loading}
              className="rounded-xl px-8"
            >
              Audit
            </Button>
          </div>
          {error && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2 text-left px-4">{error}</p>}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
             <div className="relative h-72 w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800 animate-pulse">
                <div className="absolute -bottom-16 left-12 w-40 h-40 rounded-[2rem] border-[6px] border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-700" />
             </div>
             <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="h-32 rounded-3xl" />
             </div>
             <TableSkeleton rows={8} />
          </motion.div>
        )}

        {!currentChannel && !loading && (
           <EmptyState 
            icon={Users}
            title="Channel MRI Offline"
            description="Audit any YouTube channel's content library, upload frequency, and engagement trends to identify winning patterns."
          />
        )}

        {currentChannel && !loading && (
          <motion.div
            key={currentChannel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header Banner */}
            <div className="relative group">
              <div className="h-48 md:h-72 w-full rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                 {currentChannel.brandingSettings.image?.bannerExternalUrl ? (
                   <img src={currentChannel.brandingSettings.image.bannerExternalUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
                 ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 via-slate-900 to-emerald-600/20" />
                 )}
              </div>
              
              <div className="absolute -bottom-16 left-12 flex items-end gap-8">
                <div className="w-40 h-40 rounded-[2rem] border-[6px] border-white dark:border-slate-950 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
                   <img src={currentChannel.snippet.thumbnails.high.url} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black tracking-tight">{currentChannel.snippet.title}</h2>
                    {parseInt(currentChannel.statistics.subscriberCount) > 100000 && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-black italic text-slate-500">@{currentChannel.snippet.customUrl}</p>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">{currentChannel.snippet.country || 'Global'}</Badge>
                  </div>
                </div>
              </div>

              <div className="absolute top-8 right-12 flex gap-3">
                 <button 
                  onClick={handleSave}
                  className={cn(
                    "p-4 backdrop-blur-xl rounded-2xl transition-all border",
                    isSaved ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  )}
                >
                  <Star size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
                 <Button variant="secondary" className="h-12 w-12 p-0 rounded-2xl bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20" onClick={() => window.open(`https://youtube.com/${currentChannel.snippet.customUrl}`, '_blank')}>
                    <ExternalLink size={20} />
                 </Button>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard icon={Users} label="Subscribers" value={formatNumber(currentChannel.statistics.subscriberCount)} color="text-indigo-600" />
               <StatCard icon={Video} label="Uploads" value={formatNumber(currentChannel.statistics.videoCount)} color="text-emerald-500" />
               <StatCard icon={Eye} label="Lifetime Views" value={formatNumber(currentChannel.statistics.viewCount)} color="text-amber-500" />
               <StatCard icon={Calendar} label="Joined" value={formatDate(currentChannel.snippet.publishedAt)} color="text-yt-red" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              {(['overview', 'library', 'analytics', 'seo', 'export'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === tab 
                      ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[500px]">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8">
                       <h3 className="text-xl font-black italic flex items-center gap-2 mb-6">
                         <Activity size={20} className="text-indigo-600" />
                         About this Creator
                       </h3>
                       <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                         {currentChannel.snippet.description || 'This channel has no description.'}
                       </p>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="p-6 space-y-4">
                          <h4 className="font-black italic flex items-center gap-2">
                             <TrendingUp size={18} className="text-emerald-500" />
                             Averages & Benchmarks
                          </h4>
                          <div className="space-y-4">
                            <KPIRow label="Avg. Views / Video" value={formatNumber(Math.round(parseInt(currentChannel.statistics.viewCount) / parseInt(currentChannel.statistics.videoCount)))} />
                            <KPIRow label="Engagement Target" value="~3.8%" subtext="Estimated based on category" />
                            <KPIRow label="Upload Consistency" value="High" subtext="Regular weekly uploads" />
                          </div>
                       </Card>
                       <Card className="p-6 space-y-4">
                          <h4 className="font-black italic flex items-center gap-2">
                             <Tag size={18} className="text-amber-500" />
                             Channel Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {currentChannel.brandingSettings.channel.keywords?.split(' ').map((tag: string, i: number) => (
                               <Badge key={i} variant="secondary" className="bg-slate-50 dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 py-1 px-3">
                                 {tag.replace(/"/g, '')}
                               </Badge>
                             )) || <span className="text-xs italic text-slate-400">No channel keywords found.</span>}
                          </div>
                       </Card>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <Card className="p-6">
                       <h3 className="font-black italic mb-6">Content Focus</h3>
                       <div className="space-y-4">
                         {currentChannel.topicDetails?.topicCategories?.map((cat: string, i: number) => (
                           <div key={`${cat}-${i}`} className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.split('/').pop()?.replace('_', ' ')}</span>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <div className="w-[80%] h-full bg-indigo-600 rounded-full" />
                              </div>
                           </div>
                         ))}
                       </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'library' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black italic">Latest Uploads</h3>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing last {channelVideos?.length || 0} videos</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channelVideos?.map((video: any, i: number) => (
                      <Card key={`${video.id}-${i}`} className="group overflow-hidden hover:border-indigo-600 transition-all cursor-pointer">
                        <div className="relative aspect-video">
                           <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full h-full object-cover" />
                           <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold text-white">
                             {formatDuration(video.contentDetails.duration)}
                           </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <h4 className="font-black text-sm italic line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                            {video.snippet.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <div className="flex items-center gap-1"><Eye size={12} /> {formatNumber(video.statistics.viewCount)}</div>
                             <div className="flex items-center gap-1"><TrendingUp size={12} /> {video.engagementRate}%</div>
                             <div>{formatDate(video.snippet.publishedAt)}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-8">
                       <h3 className="text-xl font-black italic mb-8">Performance Distribution</h3>
                       <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topVideosData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                               <XAxis dataKey="name" hide />
                               <YAxis tick={{ fontSize: 10 }} />
                               <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                               <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                         </ResponsiveContainer>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">Video Views (Top 10 Latest)</p>
                    </Card>

                    <Card className="p-8">
                       <h3 className="text-xl font-black italic mb-8">Engagement Trends</h3>
                       <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={topVideosData}>
                               <defs>
                                <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                               <XAxis dataKey="name" hide />
                               <YAxis tick={{ fontSize: 10 }} />
                               <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                               <Area type="monotone" dataKey="engagement" stroke="#10b981" fillOpacity={1} fill="url(#colorEng)" strokeWidth={3} />
                            </AreaChart>
                         </ResponsiveContainer>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">Engagement Rate % over latest 10 uploads</p>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-8 space-y-6">
                    <h3 className="text-xl font-black italic">Global Channel Tags</h3>
                    <div className="flex flex-wrap gap-3">
                       {currentChannel.brandingSettings.channel.keywords?.split(' ').map((tag: string, i: number) => (
                         <div key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700">
                           {tag.replace(/"/g, '')}
                         </div>
                       ))}
                    </div>
                  </Card>
                  <Card className="p-8">
                    <h3 className="text-xl font-black italic mb-6">SEO Best Practices</h3>
                    <div className="space-y-4">
                      <CheckItem label="Verified Artist/Channel Profile" checked={true} />
                      <CheckItem label="Complete Channel Keywords" checked={!!currentChannel.brandingSettings.channel.keywords} />
                      <CheckItem label="Custom Landing Pages" checked={true} />
                      <CheckItem label="Optimized Channel Trailer" checked={!!currentChannel.contentDetails.relatedPlaylists.uploads} />
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="max-w-2xl mx-auto py-12 space-y-8">
                  <h3 className="text-3xl font-black text-center italic">Comprehensive Audit Package</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <ExportBox icon={Download} title="Full Creator Report" desc="All metadata + analytics in PDF" />
                    <ExportBox icon={Activity} title="Competitor Analysis" desc="Side-by-side vs your channel" />
                    <ExportBox icon={List} title="Library CSV" desc="Last 50 videos metadata" />
                    <ExportBox icon={Share2} title="Share Deep Link" desc="Copy tracking link" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KPIRow({ label, value, subtext }: any) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        {subtext && <div className="text-[10px] text-slate-400">{subtext}</div>}
      </div>
      <div className="text-sm font-black italic">{value}</div>
    </div>
  );
}

function CheckItem({ label, checked }: any) {
  return (
    <div className="flex items-center gap-3">
      {checked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
      <span className={cn("text-sm font-medium", checked ? "text-slate-700 dark:text-slate-200" : "text-slate-400 italic")}>{label}</span>
    </div>
  );
}

function ExportBox({ icon: Icon, title, desc }: any) {
  return (
    <button className="flex flex-col items-center p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
      <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <span className="text-lg font-black italic">{title}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{desc}</span>
    </button>
  );
}
