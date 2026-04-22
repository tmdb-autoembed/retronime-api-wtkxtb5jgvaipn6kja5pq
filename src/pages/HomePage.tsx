import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Database,
  Terminal,
  ChevronRight,
  Play,
  Loader2,
  Code,
  AlertTriangle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RetroLayout } from '@/components/layout/RetroLayout';
import { toast } from 'sonner';
export function HomePage() {
  const navigate = useNavigate();
  const [epUrl, setEpUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  const handleFetchPreview = async () => {
    if (!epUrl) return;
    setFetching(true);
    setPreview(null);
    try {
      const res = await fetch(`/api/scrape/ep-detail?url=${encodeURIComponent(epUrl)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Fetch failed");
      setPreview(json.data.data);
      toast.success("Packet Intercepted", { description: "Metadata extraction complete. Prioritizing HD signals." });
    } catch (err: any) {
      toast.error("Intercept Failed", { description: err.message });
      setEpUrl(''); // Clear stale input on fail
    } finally {
      setFetching(false);
    }
  };
  return (
    <RetroLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
          <motion.div variants={item} className="inline-flex items-center gap-2 nm-inset-sm px-4 py-1.5 text-[10px] font-black text-primary tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Connection established: Edge Node #241
          </motion.div>
          <motion.div variants={item} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-slate-800">
              Anime Data <br />
              <span className="text-primary italic">Reimagined.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              High-speed metadata extraction with 
              <span className="text-slate-800 font-bold ml-1 underline decoration-primary/30 decoration-4">Priority Streaming</span>.
              Access subbed and dubbed content via optimized HD channels.
            </p>
          </motion.div>
          <motion.div variants={item} className="flex flex-wrap gap-6 pt-4">
            <Link to="/playground">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-nm-flat hover:shadow-nm-inset transition-all flex items-center gap-2 group">
                <Terminal className="w-5 h-5" />
                ACCESS TERMINAL
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="/docs.html">
              <button className="bg-white text-slate-600 px-8 py-4 rounded-2xl font-black text-sm shadow-nm-flat hover:shadow-nm-inset transition-all">
                VIEW_DOCS.SH
              </button>
            </a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden lg:block relative">
          <div className="nm-flat p-8 rounded-[3rem] bg-white relative overflow-hidden">
            <div className="flex gap-2 mb-6 nm-inset-sm p-3 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-auto text-[9px] font-black text-slate-300 uppercase tracking-widest">stream_priority_v2.json</span>
            </div>
            <div className="nm-inset p-6 rounded-2xl">
              <pre className="text-xs text-primary font-bold leading-relaxed">
{`{
  "priority": [
    "HD-1_SUB",
    "HD-1_DUB",
    "HD-2_SUB"
  ],
  "status": "STABLE",
  "nodes": 24,
  "cache": "MISS"
}`}
              </pre>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 nm-flat rounded-full flex items-center justify-center">
            <Zap className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-32 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Intelligent Injection</h2>
          <p className="text-slate-400 font-bold text-sm">Target any series slug. Audio tracks (Sub/Dub) are auto-detected.</p>
        </div>
        <div className="max-w-4xl mx-auto nm-flat p-8 rounded-[2.5rem] bg-white space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={epUrl}
              onChange={(e) => setEpUrl(e.target.value)}
              placeholder="https://9anime.org.lv/watch/solo-leveling-dub-ep-1/"
              className="flex-1 bg-background border-none nm-inset h-14 px-6 rounded-2xl font-bold"
            />
            <button
              onClick={handleFetchPreview}
              disabled={fetching || !epUrl}
              className="nm-flat bg-emerald-600 text-white px-8 h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-95 active:nm-inset transition-all disabled:opacity-50"
            >
              {fetching ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "PROBE_SOURCE"}
            </button>
          </div>
          <AnimatePresence>
            {preview && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 border-t border-slate-100 space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center nm-inset-sm p-6 rounded-3xl">
                  <img src={preview.poster} className="w-24 h-36 object-cover nm-flat-sm" alt="Preview" />
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <h3 className="text-xl font-black text-slate-800 line-clamp-1">{preview.title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <span className="nm-flat-sm bg-white px-4 py-1 rounded-full text-[9px] font-black text-slate-400 uppercase">{preview.servers.length} Streams</span>
                      <span className="nm-flat-sm bg-white px-4 py-1 rounded-full text-[9px] font-black text-emerald-600 uppercase">Source_Verified</span>
                      {epUrl.toLowerCase().includes('dub') && (
                        <span className="nm-flat-sm bg-indigo-50 px-4 py-1 rounded-full text-[9px] font-black text-indigo-600 uppercase">Dub_Detected</span>
                      )}
                    </div>
                    <div className="flex gap-4 justify-center md:justify-start">
                      <button
                        onClick={() => navigate(`/watch?url=${encodeURIComponent(epUrl)}`)}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-nm-flat flex items-center gap-2 hover:shadow-nm-inset transition-all"
                      >
                        <Play className="w-3 h-3" /> LAUNCH_CINEMA
                      </button>
                      <button
                        onClick={() => setShowJson(!showJson)}
                        className="nm-flat-sm bg-white text-slate-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <Code className="w-3 h-3" /> {showJson ? "HIDE_PACKET" : "RAW_DATA"}
                      </button>
                    </div>
                  </div>
                </div>
                {showJson && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="nm-inset p-6 rounded-3xl bg-slate-900 overflow-auto max-h-64">
                    <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                      {JSON.stringify(preview, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: ShieldCheck, label: "Bot-Proof", desc: "Adaptive header cycling and intelligent fallbacks ensure 99.9% uptime." },
          { icon: Database, label: "Priority Streams", desc: "HD-1 Sub and Dub channels are automatically prioritized for every episode." },
          { icon: Zap, label: "Sub-200ms", desc: "Global edge network delivers parsed metadata at lightning speed." }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * i }}
            className="nm-flat p-8 rounded-3xl bg-white hover:nm-inset transition-all group"
          >
            <div className="w-12 h-12 nm-inset-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-800">{feature.label}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </RetroLayout>
  );
}