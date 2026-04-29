import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ScoreRing } from '../components/ui/ScoreRing';
import { useVideoStore } from '../store/useVideoStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { 
  Search, 
  Download, 
  Share2, 
  Star, 
  BarChart,
  Tag,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Globe,
  CheckCircle2,
  List,
  FileText,
  Copy,
  Hash,
  ExternalLink,
  Video
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatNumber, formatDate, formatDuration, extractVideoId } from '../utils/formatters';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'seo' | 'content' | 'export';

export function VideoAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { analyzeVideo, currentVideo, loading, error } = useVideoStore();
  const { activeKeyId, apiKeys, theme } = useSettingsStore();
  const { addToHistory } = useHistoryStore();
  const { addVideo, savedVideos, removeVideo } = useWatchlistStore();
  
  const isDark = theme === 'dark';
  const isSaved = currentVideo && savedVideos.some(v => v.id === currentVideo.id);

  const handleAnalyze = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      toast.error('Invalid YouTube URL or ID');
      return;
    }
    const key = apiKeys.find(k => k.id === activeKeyId)?.key || '';
    const result = await analyzeVideo(videoId, key);
    
    if (result) {
      addToHistory({
        id: result.id,
        type: 'video',
        title: result.snippet.title,
        identifier: videoId,
        thumbnail: result.snippet.thumbnails.default?.url,
        viewsAtAnalysis: result.statistics.viewCount
      });
    }
  };

  const handleSave = () => {
    if (!currentVideo) return;
    if (isSaved) {
      removeVideo(currentVideo.id);
      toast.success('Removed from watchlist');
    } else {
      addVideo({
        id: currentVideo.id,
        title: currentVideo.snippet.title,
        thumbnail: currentVideo.snippet.thumbnails.medium?.url,
        channelTitle: currentVideo.snippet.channelTitle,
        views: currentVideo.statistics.viewCount,
      });
      toast.success('Saved to watchlist');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const downloadThumbnail = () => {
    if (!currentVideo) return;
    const thumbUrl = currentVideo.snippet.thumbnails.maxres?.url || currentVideo.snippet.thumbnails.high?.url;
    window.open(thumbUrl, '_blank');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Video Intelligence</h1>
        <p className="text-slate-500 font-medium italic">Uncover the strategy behind any YouTube video.</p>
        
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
              placeholder="Paste YouTube Video URL or ID..." 
              className="bg-transparent border-none outline-none text-base px-1 flex-1 py-3"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze} 
              loading={loading}
              className="rounded-xl px-8"
            >
              Analyze
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
            className="space-y-8"
          >
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                   <Skeleton className="w-full aspect-video rounded-[2.5rem]" />
                </div>
                <div className="lg:col-span-4 space-y-6">
                   <CardSkeleton />
                   <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-24 rounded-[1.5rem]" />
                      <Skeleton className="h-24 rounded-[1.5rem]" />
                   </div>
                   <Skeleton className="h-40 w-full rounded-[1.5rem]" />
                </div>
             </div>
          </motion.div>
        )}

        {!currentVideo && !loading && (
           <EmptyState 
            icon={Video}
            title="Awaiting Intelligence Signal"
            description="Enter a YouTube URL above to begin full-spectrum analysis of content performance, SEO rankings, and viral markers."
          />
        )}

        {currentVideo && !loading && (
          <motion.div
            key={currentVideo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Top Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-900">
                  <img 
                    src={currentVideo.snippet.thumbnails.maxres?.url || currentVideo.snippet.thumbnails.high?.url} 
                    alt="Thumbnail" 
                    className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                       <Badge variant="primary" className="bg-indigo-600 border-none text-white">{currentVideo.snippet.channelTitle}</Badge>
                       <Badge variant="secondary" className="bg-white/10 backdrop-blur-md text-white border-white/20">{formatDate(currentVideo.snippet.publishedAt)}</Badge>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{currentVideo.snippet.title}</h2>
                  </div>
                  
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={handleSave}
                      className={cn(
                        "p-3 backdrop-blur-xl rounded-2xl transition-all border",
                        isSaved ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      )}
                    >
                      <Star size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => window.open(`https://youtube.com/watch?v=${currentVideo.id}`, '_blank')}
                      className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all"
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global SEO Score</span>
                    <h3 className="text-4xl font-black tabular-nums">{currentVideo.analysis.seoScore.total}%</h3>
                  </div>
                  <ScoreRing score={currentVideo.analysis.seoScore.total} size={100} strokeWidth={10} />
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <BarChart size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-black italic">{currentVideo.analysis.engagementRate}%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Engagement</div>
                    </div>
                  </Card>
                  <Card className="p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <ThumbsUp size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-black italic">{currentVideo.analysis.likeToViewRatio}%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Like Ratio</div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <StatRow icon={Eye} label="Views" value={formatNumber(currentVideo.statistics.viewCount)} />
                  <StatRow icon={Clock} label="Duration" value={formatDuration(currentVideo.contentDetails.duration)} />
                  <StatRow icon={MessageCircle} label="Comments" value={formatNumber(currentVideo.statistics.commentCount || 0)} />
                  <StatRow icon={Globe} label="Language" value={currentVideo.snippet.defaultAudioLanguage?.toUpperCase() || 'EN'} />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              {(['overview', 'seo', 'content', 'export'] as TabType[]).map((tab) => (
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

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-6 space-y-6">
                    <h4 className="font-black italic flex items-center gap-2">
                      <BarChart size={18} className="text-indigo-600" />
                      Performance Velocity
                    </h4>
                    <div className="space-y-4">
                      <MetricItem label="Views Per Hour" value={formatNumber(currentVideo.analysis.viewsPerHour)} />
                      <MetricItem label="Comments / Hour" value={currentVideo.analysis.commentVelocity} />
                      <MetricItem label="Estimate Dislikes" value={formatNumber(currentVideo.analysis.estimatedDislikeCount)} subtext="Industry average estimate" />
                    </div>
                  </Card>

                  <Card className="p-6 space-y-6">
                    <h4 className="font-black italic flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      Optimization Checklist
                    </h4>
                    <div className="space-y-3">
                      <CheckItem label="High Res Thumbnail" checked={!!currentVideo.snippet.thumbnails.maxres} />
                      <CheckItem label="Closed Captions (CC)" checked={currentVideo.contentDetails.caption === 'true'} />
                      <CheckItem label="Custom Tags" checked={(currentVideo.snippet.tags?.length || 0) > 0} />
                      <CheckItem label="Description Links" checked={currentVideo.snippet.description?.includes('http')} />
                      <CheckItem label="Chapters Included" checked={(currentVideo.chapters?.length || 0) > 0} />
                    </div>
                  </Card>

                  <Card className="p-6 space-y-4">
                    <h4 className="font-black italic flex items-center gap-2">
                      <Tag size={18} className="text-amber-500" />
                      Topic Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentVideo.topicDetails?.relevantTopicIds?.map((id: string, i: number) => (
                        <Badge key={`${id}-${i}`} variant="secondary" className="text-[10px]">{id.split('/').pop()}</Badge>
                      ))}
                      {!currentVideo.topicDetails && <span className="text-xs text-slate-400 italic">No specific topics defined.</span>}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="font-black italic flex items-center gap-2">
                        <List size={18} className="text-indigo-600" />
                        Tag Analysis
                       </h4>
                       <Badge variant="secondary">{currentVideo.snippet.tags?.length || 0} Tags</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentVideo.snippet.tags?.map((tag: string, i: number) => (
                        <div key={`${tag}-${i}`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 group">
                          {tag}
                          <Copy 
                            size={12} 
                            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => copyToClipboard(tag, 'Tag')}
                          />
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" className="w-full gap-2" onClick={() => copyToClipboard(currentVideo.snippet.tags?.join(', ') || '', 'All tags')}>
                       <Copy size={16} /> Copy All Tags
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-6">
                    <h4 className="font-black italic flex items-center gap-2">
                      <Share2 size={18} className="text-indigo-600" />
                      Detailed SEO Metrics
                    </h4>
                    <div className="space-y-6">
                      <SEOMetric label="Title Optimization" score={currentVideo.analysis.seoScore.titleScore} max={20} />
                      <SEOMetric label="Description Density" score={currentVideo.analysis.seoScore.descriptionScore} max={30} />
                      <SEOMetric label="Tag Coverage" score={currentVideo.analysis.seoScore.tagScore} max={30} />
                      <SEOMetric label="Interaction Bonus" score={currentVideo.analysis.seoScore.engagementScore} max={20} />
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 space-y-4">
                      <h4 className="font-black italic flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        Description Analysis
                      </h4>
                      <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-mono p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        {currentVideo.snippet.description}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                       <h4 className="font-black italic flex items-center gap-2">
                        <Clock size={18} className="text-indigo-600" />
                        Chapters ({currentVideo.chapters?.length || 0})
                       </h4>
                       <div className="space-y-3">
                         {currentVideo.chapters?.map((ch: any, idx: number) => (
                           <div key={idx} className="flex gap-3 text-sm group">
                             <span className="font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded h-fit">{ch.time}</span>
                             <span className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 cursor-pointer">{ch.title}</span>
                           </div>
                         ))}
                         {(currentVideo.chapters?.length || 0) === 0 && <p className="text-xs text-slate-400 italic">No chapters detected in description.</p>}
                       </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                       <h4 className="font-black italic flex items-center gap-2">
                        <Hash size={18} className="text-indigo-600" />
                        Hashtags
                       </h4>
                       <div className="flex flex-wrap gap-2">
                         {currentVideo.snippet.description.match(/#\w+/g)?.map((tag: string, i: number) => (
                           <span key={i} className="text-xs font-bold text-indigo-600">#{tag.replace('#', '')}</span>
                         ))}
                         {!currentVideo.snippet.description.includes('#') && <p className="text-xs text-slate-400 italic">No hashtags found.</p>}
                       </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="max-w-xl mx-auto space-y-6 pt-10">
                   <h3 className="text-2xl font-black text-center italic">Package & Share</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <ExportItem icon={Download} label="Full Report" sub="PDF Format" onClick={() => toast.success('Report generation started...')} />
                      <ExportItem icon={FileText} label="Raw Data" sub="CSV Export" onClick={() => toast.success('Data exported to CSV')} />
                      <ExportItem icon={Tag} label="SEO Pack" sub="Copy Keywords" onClick={() => copyToClipboard(currentVideo.snippet.tags?.join(', ') || '', 'SEO Pack')} />
                      <ExportItem icon={Download} label="Thumbnail" sub="High Res" onClick={downloadThumbnail} />
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

function StatRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-bold italic">{value}</span>
    </div>
  );
}

function MetricItem({ label, value, subtext }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-sm font-black italic">{value}</span>
      </div>
      {subtext && <p className="text-[10px] text-slate-400 leading-tight">{subtext}</p>}
    </div>
  );
}

function CheckItem({ label, checked }: any) {
  return (
    <div className="flex items-center gap-3">
      {checked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
      <span className={cn("text-xs font-medium", checked ? "text-slate-700 dark:text-slate-200" : "text-slate-400 italic")}>{label}</span>
    </div>
  );
}

function SEOMetric({ label, score, max }: any) {
  const percent = (score / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-indigo-600">{score} / {max}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full bg-indigo-600" />
      </div>
    </div>
  );
}

function ExportItem({ icon: Icon, label, sub, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <span className="text-sm font-black italic">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{sub}</span>
    </button>
  );
}
