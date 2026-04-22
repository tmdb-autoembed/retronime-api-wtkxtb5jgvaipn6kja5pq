import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Home, Play, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
export function RetroLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background relative flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Neumorphic Header */}
      <header className="py-4 sticky top-0 bg-[#f5f5f5]/80 backdrop-blur-md z-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between shadow-nm-flat-sm p-3 md:p-4 rounded-2xl bg-[#f5f5f5]">
          <Link to="/" className="flex items-center gap-3 text-primary font-black tracking-tight group">
            <div className="w-8 h-8 rounded-lg shadow-nm-inset-sm flex items-center justify-center bg-background group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-lg transition-all duration-300 origin-left",
              "hidden sm:inline"
            )}>
              RETRONIME_API
            </span>
            <span className="sm:hidden text-lg">RN_API</span>
          </Link>
          <nav className="flex items-center gap-1.5 md:gap-3">
            {[
              { to: '/', icon: Home, label: 'Home' },
              { to: '/playground', icon: Play, label: 'Terminal' }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-5 py-2.5 text-[10px] font-black uppercase transition-all rounded-xl",
                  location.pathname === link.to
                    ? "shadow-nm-inset text-primary bg-[#f5f5f5]"
                    : "text-slate-500 hover:text-primary hover:shadow-nm-flat-sm"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {children}
        </div>
      </main>
      {/* Footer Status Bar */}
      <footer className="p-4 md:p-8 bg-background">
        <div className="max-w-7xl mx-auto shadow-nm-inset-sm rounded-[2rem] p-5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black text-slate-400 gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" /> 
              SYSTEM: OPTIMAL_RUNNING
            </span>
            <span className="hidden sm:inline border-l border-slate-300 pl-6 uppercase tracking-widest text-[9px]">
              Distributed Edge Scraping Architecture
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="tracking-tighter">v1.2.5_STABLE_REL</span>
            <div className="w-8 h-8 rounded-full shadow-nm-flat-sm flex items-center justify-center hover:text-primary hover:shadow-nm-inset transition-all cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}