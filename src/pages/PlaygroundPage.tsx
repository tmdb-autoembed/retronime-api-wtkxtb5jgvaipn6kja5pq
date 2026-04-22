import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, AlertCircle, Loader2, Search, Zap, Info, Link as LinkIcon, Layers, Terminal as TerminalIcon } from 'lucide-react';
import { RetroLayout } from '@/components/layout/RetroLayout';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
type Endpoint = 'recent' | 'search' | 'info' | 'links' | 'full-series';
export function PlaygroundPage() {
  const [endpoint, setEndpoint] = useState<Endpoint>('recent');
  const [query, setQuery] = useState('');
  const [urlParam, setUrlParam] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setResponse(null);
    setError(null);
    setQuery('');
    setUrlParam('');
  }, [endpoint]);
  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    let path = endpoint === 'links' ? 'eps-links' : endpoint;
    if (endpoint === 'full-series') path = 'full-series-eps';
    let url = `/api/scrape/${path}`;
    const params = new URLSearchParams();
    if (endpoint === 'search' && query) params.append('q', query);
    if ((endpoint === 'info' || endpoint === 'links') && urlParam) params.append('url', urlParam);
    if (endpoint === 'full-series' && urlParam) params.append('ep_url', urlParam);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      toast.success('Query Executed');
    } catch (err: any) {
      setError(err.message);
      toast.error('Query Failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };
  const copyUrl = () => {
    let path = endpoint === 'links' ? 'eps-links' : endpoint;
    if (endpoint === 'full-series') path = 'full-series-eps';
    const params = new URLSearchParams();
    if (endpoint === 'search' && query) params.append('q', query);
    if ((endpoint === 'info' || endpoint === 'links') && urlParam) params.append('url', urlParam);
    if (endpoint === 'full-series' && urlParam) params.append('ep_url', urlParam);
    const fullUrl = `${window.location.origin}/api/scrape/${path}${params.toString() ? '?' + params.toString() : ''}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link Copied');
  };
  const menuItems = [
    { id: 'recent', label: 'Recent Uploads', icon: Zap },
    { id: 'search', label: 'Anime Search', icon: Search },
    { id: 'info', label: 'Series Info', icon: Info },
    { id: 'links', label: 'Episode Links', icon: LinkIcon },
    { id: 'full-series', label: 'Full Cluster', icon: Layers },
  ];
  return (
    <RetroLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="shadow-nm-flat p-6 rounded-3xl bg-white">
            <h2 className="text-xs font-black mb-6 uppercase tracking-[0.2em] text-slate-400">Endpoint_Nav</h2>
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setEndpoint(item.id as Endpoint)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl text-xs font-bold transition-all text-left",
                    endpoint === item.id
                      ? "shadow-nm-inset text-primary bg-background"
                      : "text-slate-500 hover:shadow-nm-flat-sm hover:text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Console Area */}
        <div className="lg:col-span-9 space-y-8">
          <div className="shadow-nm-flat p-8 rounded-[2.5rem] bg-white space-y-6">
            <div className="flex flex-wrap items-end gap-6">
              {endpoint === 'search' && (
                <div className="flex-1 min-w-[200px] space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest px-1">Query Parameter (q)</label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search query..."
                    className="bg-[#f1f5f9] border-none shadow-nm-inset rounded-xl h-12 px-4 focus-visible:ring-primary font-bold"
                  />
                </div>
              )}
              {(endpoint === 'info' || endpoint === 'links' || endpoint === 'full-series') && (
                <div className="flex-1 min-w-[200px] space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest px-1">URL Path (Relative)</label>
                  <Input
                    value={urlParam}
                    onChange={(e) => setUrlParam(e.target.value)}
                    placeholder={endpoint === 'full-series' ? "/one-piece-dub-episode-1/" : "/watch/one-piece-1158"}
                    className="bg-[#f1f5f9] border-none shadow-nm-inset rounded-xl h-12 px-4 focus-visible:ring-primary font-bold"
                  />
                </div>
              )}
              {endpoint === 'recent' && (
                <div className="flex-1 p-4 shadow-nm-inset-sm rounded-xl bg-background text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center self-center">
                  Fetching Global Recent Clusters
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="bg-primary text-white h-12 px-8 rounded-xl font-black text-xs shadow-nm-flat active:shadow-nm-inset transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> EXECUTE</>}
                </button>
                <button 
                  onClick={copyUrl}
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-nm-flat bg-white text-slate-400 hover:text-primary transition-all active:shadow-nm-inset"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="shadow-nm-inset rounded-3xl bg-[#f8f9ff] overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-slate-200 bg-white/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Response Buffer :: {endpoint.toUpperCase()}
                  </span>
                </div>
                {response?.data?.source && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-nm-flat-sm",
                    response.data.source === 'live' ? "bg-primary text-white" : "bg-indigo-500 text-white"
                  )}>
                    {response.data.source}
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 overflow-auto max-h-[600px] scrollbar-hide">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center py-20"
                    >
                      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Processing_Packets</span>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center py-20 text-red-400"
                    >
                      <AlertCircle className="w-12 h-12 mb-4" />
                      <span className="font-black text-xs uppercase tracking-widest">{error}</span>
                    </motion.div>
                  ) : response ? (
                    <motion.pre
                      key="data"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-primary font-bold leading-relaxed whitespace-pre-wrap break-all"
                    >
                      {JSON.stringify(response, null, 2)}
                    </motion.pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300 italic text-sm">
                      <TerminalIcon className="w-12 h-12 opacity-10 mb-4" />
                      <div>Awaiting command execution...</div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
}