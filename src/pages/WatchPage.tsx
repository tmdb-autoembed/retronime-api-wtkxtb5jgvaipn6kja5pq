import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Monitor,
  AlertCircle,
  Volume2,
  Subtitles
} from 'lucide-react';
import { RetroLayout } from '@/components/layout/RetroLayout';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function WatchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const epUrl = searchParams.get('url');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeServer, setActiveServer] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!epUrl) {
      setError("No episode URL provided");
      setLoading(false);
      return;
    }
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/scrape/ep-detail?url=${encodeURIComponent(epUrl)}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to fetch metadata");
        }
        const fetchedData = json.data.data;
        setData(fetchedData);
        // Intelligent Track Detection
        const isDub = epUrl.toLowerCase().includes('dub');
        const targetCategory = isDub ? 'dub' : 'sub';
        // Find prioritized server for the detected category (case-insensitive)
        const preferredIndex = fetchedData.servers.findIndex((s: any) =>
          s.name.toLowerCase().includes(targetCategory) ||
          s.url.toLowerCase().includes(`category=${targetCategory}`)
        );
        setActiveServer(preferredIndex !== -1 ? preferredIndex : 0);
        toast.success("Source Synced", { description: `Optimal ${targetCategory.toUpperCase()} channel locked.` });
      } catch (err: any) {
        setError(err.message);
        console.error("Cinema Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [epUrl]);
  const handleNav = (target: string | null) => {
    if (!target) return;
    navigate(`/watch?url=${encodeURIComponent(target)}`);
  };
  const currentServer = data?.servers?.[activeServer];
  return (
    <RetroLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-[60vh] nm-inset flex flex-col items-center justify-center rounded-[3rem]"
            >
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Initializing_Cinema_Link</h2>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="h-[40vh] nm-flat flex flex-col items-center justify-center p-10 text-center rounded-[3rem]"
            >
              <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
              <h2 className="text-xl font-black text-slate-800 mb-2 uppercase">Interface Failure</h2>
              <p className="text-slate-500 font-medium">{error}</p>
              <button 
                onClick={() => navigate(-1)} 
                className="mt-8 nm-flat-sm px-8 py-3 bg-background text-[10px] font-black uppercase text-primary hover:nm-inset transition-all"
              >
                Return_to_Safety
              </button>
            </motion.div>
          ) : data && (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 px-4">
                <div className="w-24 h-32 nm-flat-sm overflow-hidden flex-shrink-0 rounded-2xl">
                  <img src={data.poster} className="w-full h-full object-cover" alt="Poster" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-800 leading-tight">
                    {data.title}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className={cn(
                      "nm-inset-sm px-4 py-1.5 text-[10px] font-black uppercase flex items-center gap-2 rounded-full",
                      epUrl?.toLowerCase().includes('dub') ? "text-indigo-600" : "text-primary"
                    )}>
                      {epUrl?.toLowerCase().includes('dub') ? <Volume2 className="w-3 h-3" /> : <Subtitles className="w-3 h-3" />}
                      {epUrl?.toLowerCase().includes('dub') ? 'Audio_Dubbed' : 'Audio_Subbed'}
                    </span>
                    <span className="nm-inset-sm px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase rounded-full">
                      Edge_Node_Sync
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video nm-inset overflow-hidden bg-black shadow-2xl rounded-[2.5rem]">
                {currentServer ? (
                  <iframe
                    title={`Anime Player - ${data.title}`}
                    src={currentServer.url}
                    className="w-full h-full border-none"
                    allowFullScreen
                    scrolling="no"
                    referrerPolicy="no-referrer"
                    allow="autoplay; encrypted-media; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <AlertCircle className="w-12 h-12" />
                    <span className="text-xs font-black uppercase tracking-widest">No Signal Detected</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                  <div className="nm-flat p-6 rounded-[2rem]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Monitor className="w-3 h-3" /> Signal_Channel
                    </h3>
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
                      {data.servers.map((s: any, i: number) => {
                        const isDubServer = s.name.toLowerCase().includes('dub') || s.url.toLowerCase().includes('category=dub');
                        const isActive = activeServer === i;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveServer(i)}
                            className={cn(
                              "w-full p-4 rounded-2xl text-[10px] font-bold text-left transition-all uppercase flex items-center justify-between",
                              isActive
                                ? "nm-inset text-primary bg-background shadow-inner"
                                : "text-slate-500 hover:nm-flat-sm hover:text-primary bg-white"
                            )}
                          >
                            <span className="truncate mr-2 flex items-center gap-2">
                              {isDubServer ? <Volume2 className="w-3 h-3 opacity-50" /> : <Subtitles className="w-3 h-3 opacity-50" />}
                              {s.name}
                            </span>
                            <Play className={cn("w-3 h-3 flex-shrink-0 transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-8">
                  <div className="nm-flat p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleNav(data.prev_ep_url)}
                        disabled={!data.prev_ep_url}
                        className="nm-flat-sm bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all active:nm-inset"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleNav(data.next_ep_url)}
                        disabled={!data.next_ep_url}
                        className="nm-flat-sm bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all active:nm-inset"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex-1 text-center hidden sm:block">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Playback_Authorized :: Node_0x24</span>
                    </div>
                  </div>
                  {data.downloads && data.downloads.length > 0 && (
                    <div className="nm-flat p-8 rounded-[2rem]">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Download className="w-3 h-3" /> Mirror_Injection
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {data.downloads.map((dl: any, i: number) => (
                          <a
                            key={i}
                            href={dl.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nm-inset-sm p-4 rounded-2xl text-center group hover:nm-flat-sm transition-all bg-white"
                          >
                            <div className="text-primary font-black text-lg mb-1">{dl.quality}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Download_Link</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RetroLayout>
  );
}