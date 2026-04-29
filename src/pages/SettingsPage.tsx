import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useSettingsStore } from '../store/useSettingsStore';
import { 
  Key, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  Info,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Database,
  Eye,
  EyeOff,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { 
    apiKeys, 
    addKey, 
    removeKey, 
    setActiveKey, 
    quotaUsed, 
    theme, 
    toggleTheme 
  } = useSettingsStore();

  const [newKey, setNewKey] = useState('');
  const [nickname, setNickname] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const QUOTA_LIMIT = 10000;
  const quotaPercent = Math.min(100, (quotaUsed / QUOTA_LIMIT) * 100);

  const handleAddKey = () => {
    if (!newKey || !nickname) {
      toast.error('Please fill in both fields');
      return;
    }
    addKey({
      id: Math.random().toString(36).substr(2, 9),
      nickname,
      key: newKey
    });
    setNewKey('');
    setNickname('');
    setShowKeyInput(false);
    toast.success('API Node deployed successfully');
  };

  const toggleSecret = (id: string) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight italic">System Config</h1>
          <p className="text-slate-500 font-medium italic">Command center for your intelligence nodes and environment.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
           <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                theme === 'light' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
              )}
           >
             <Sun size={14} /> Light
           </button>
           <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500"
              )}
           >
             <Moon size={14} /> Dark
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="p-8 border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Key size={120} /></div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black italic flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" size={24} />
                YouTube API Nodes
              </h2>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="gap-2 bg-slate-100 dark:bg-slate-800 border-none h-10 px-4"
              >
                <Plus size={16} /> {showKeyInput ? 'Close' : 'Add Node'}
              </Button>
            </div>

            <AnimatePresence>
              {showKeyInput && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Node Nickname</label>
                        <input 
                          type="text" 
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="Primary / Backup / SEO" 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">API Key String</label>
                        <input 
                          type="password" 
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          placeholder="AIza..." 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                       <Button variant="secondary" size="sm" onClick={() => setShowKeyInput(false)}>Cancel</Button>
                       <Button variant="emerald" size="sm" onClick={handleAddKey}>Deploy Key</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                   <p className="text-slate-400 italic text-sm">No intelligence nodes active. System is dormant.</p>
                </div>
              ) : (
                apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-600/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <div 
                        onClick={() => setActiveKey(key.id)}
                        className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm",
                        key.isActive ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                       )}>
                          <ShieldCheck size={20} />
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black italic">{key.nickname}</span>
                            {key.isActive && <Badge className="bg-emerald-500 text-white border-none text-[8px] px-1.5 h-4">ACTIVE</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-slate-400">
                               {showSecret[key.id] ? key.key : '••••••••••••••••••••••••'}
                             </span>
                             <button onClick={() => toggleSecret(key.id)} className="text-slate-300 hover:text-indigo-600">
                               {showSecret[key.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase text-slate-400">Node Status</p>
                          <p className="text-xs font-black italic text-emerald-500">OPTIMAL</p>
                       </div>
                       <button 
                        onClick={() => removeKey(key.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-8 border-none bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute left-0 bottom-0 p-8 opacity-10"><Database size={120} /></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic flex items-center gap-2">
                   <Activity size={20} className="text-indigo-400" />
                   Total Instance Usage
                </h3>
                <Badge className={cn(
                  "border-none h-6 px-3 flex items-center gap-1 text-[10px] uppercase font-black italic",
                  quotaPercent > 90 ? "bg-rose-500 text-white" : quotaPercent > 70 ? "bg-amber-500 text-black" : "bg-emerald-500 text-white"
                )}>
                  {quotaPercent > 90 ? 'Critical' : quotaPercent > 70 ? 'Warning' : 'Stable'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase text-slate-400 tracking-widest">
                   <span>Daily Points Consumed</span>
                   <span>{quotaUsed.toLocaleString()} / {QUOTA_LIMIT.toLocaleString()}</span>
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${quotaPercent}%` }}
                    className={cn(
                      "h-full transition-all",
                      quotaPercent > 90 ? "bg-rose-500" : quotaPercent > 70 ? "bg-amber-500" : "bg-indigo-500"
                    )} 
                   />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/5">
                 <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Efficiency</p>
                    <p className="text-xl font-black italic">98.4%</p>
                 </div>
                 <div className="text-center border-x border-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Response</p>
                    <p className="text-xl font-black italic">240ms</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Uptime</p>
                    <p className="text-xl font-black italic">100%</p>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="p-8 space-y-6">
              <h3 className="font-black italic flex items-center gap-2">
                <Info size={18} className="text-indigo-600" />
                Security Guide
              </h3>
              <div className="space-y-5">
                 <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                       <ShieldCheck size={12} />
                    </div>
                    <p className="text-xs text-slate-500 italic leading-snug font-medium">Keys are stored locally and never transmitted to our servers.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                       <Zap size={12} />
                    </div>
                    <p className="text-xs text-slate-500 italic leading-snug font-medium">Multi-key support allows for automatic failover during high usage.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                       <SettingsIcon size={12} />
                    </div>
                    <p className="text-xs text-slate-500 italic leading-snug font-medium">Resetting data is irreversible and wipes all historical intelligence.</p>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" className="w-full h-11 bg-rose-500 hover:bg-rose-600 text-white border-none font-black italic text-xs gap-2">
                   <RotateCcw size={16} /> RESET ENVIRONMENT
                </Button>
              </div>
           </Card>

           <div className="p-6 bg-indigo-600 rounded-3xl text-white space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-xl">
                    <Zap size={20} />
                 </div>
                 <h4 className="font-black italic">Pro Member</h4>
              </div>
              <p className="text-xs text-indigo-100 italic leading-relaxed">
                 You are currently using the Professional license. All advanced AI features are unlocked.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
