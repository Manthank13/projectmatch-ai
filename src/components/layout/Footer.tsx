import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface/80 dark:bg-space-black/80 backdrop-blur-xl py-8 mt-auto z-20">
      <div className="app-page-container flex flex-col sm:flex-row items-center justify-between gap-4 font-headline text-xs">
        {/* Brand & Subtext */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-sm font-bold shadow-cyan-glow">
            ✦
          </div>
          <div>
            <span className="font-extrabold text-on-surface tracking-tight">
              PROJECTMATCH
            </span>
            <span className="text-on-surface-variant ml-2">
              — AI Team Architect OS
            </span>
          </div>
        </div>

        {/* Fictional Synthetic Disclaimer */}
        <p className="text-[11px] font-body text-on-surface-variant text-center sm:text-left max-w-md">
          SRM INNOVATION GRID is a fictional synthetic campus ecosystem built for hackathon demonstrations.
        </p>

        {/* System Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated/60 border border-outline-variant text-[10px] font-bold text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-mint-accent animate-pulse" />
          <span>GRID TELEMETRY ONLINE</span>
        </div>
      </div>
    </footer>
  );
};
