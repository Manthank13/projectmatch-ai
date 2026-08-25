import React from 'react';
import { TeamDNAMetric } from '../../types';

interface TeamDNAGraphProps {
  metrics: TeamDNAMetric[];
}

export const TeamDNAGraph: React.FC<TeamDNAGraphProps> = ({ metrics }) => {
  return (
    <div className="bento-card rounded-3xl p-6 sm:p-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 text-primary font-headline text-xs font-bold uppercase tracking-wider">
        <span className="material-symbols-outlined text-lg">donut_large</span>
        <span>COLLECTIVE TEAM TOPOLOGY</span>
      </div>

      <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-6 text-center">
        YOUR TEAM'S DNA
      </h2>

      <div className="w-full max-w-2xl h-80 bg-surface-bright rounded-2xl border border-outline-variant/50 flex items-center justify-center relative overflow-hidden shadow-inner p-4">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--outline) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Circular Satellite Topology */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Central Squad Core */}
          <div className="w-20 h-20 bg-primary-container rounded-full flex flex-col items-center justify-center text-on-primary-container font-headline font-extrabold z-10 shadow-lg border-4 border-surface-bright animate-float">
            <span className="text-xs">SQUAD</span>
            <span className="text-sm">93.4</span>
          </div>

          {/* Satellites */}
          {/* Satellite 1: Top (ML & Tech) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-16 bg-secondary-fixed text-on-secondary-fixed rounded-2xl flex flex-col items-center justify-center text-[10px] font-headline font-bold text-center leading-tight shadow-md border-2 border-surface-bright animate-float-delayed">
            <span>Tech</span>
            <span className="text-xs font-extrabold text-primary">96%</span>
          </div>

          {/* Satellite 2: Bottom (Domain) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-16 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl flex flex-col items-center justify-center text-[10px] font-headline font-bold text-center leading-tight shadow-md border-2 border-surface-bright animate-float">
            <span>Domain</span>
            <span className="text-xs font-extrabold text-tertiary">92%</span>
          </div>

          {/* Satellite 3: Left (Backend) */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-16 h-16 bg-secondary-fixed-dim text-on-secondary-fixed rounded-2xl flex flex-col items-center justify-center text-[10px] font-headline font-bold text-center leading-tight shadow-md border-2 border-surface-bright animate-float-delayed">
            <span>Backend</span>
            <span className="text-xs font-extrabold text-secondary">98%</span>
          </div>

          {/* Satellite 4: Right (Design) */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-16 h-16 bg-primary-fixed text-on-primary-fixed rounded-2xl flex flex-col items-center justify-center text-[10px] font-headline font-bold text-center leading-tight shadow-md border-2 border-surface-bright animate-float">
            <span>UX/Design</span>
            <span className="text-xs font-extrabold text-primary">90%</span>
          </div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line stroke="var(--outline-variant)" strokeWidth="2" strokeDasharray="3 3" x1="50%" y1="50%" x2="50%" y2="12%" />
            <line stroke="var(--outline-variant)" strokeWidth="2" strokeDasharray="3 3" x1="50%" y1="50%" x2="50%" y2="88%" />
            <line stroke="var(--outline-variant)" strokeWidth="2" strokeDasharray="3 3" x1="50%" y1="50%" x2="12%" y2="50%" />
            <line stroke="var(--outline-variant)" strokeWidth="2" strokeDasharray="3 3" x1="50%" y1="50%" x2="88%" y2="50%" />
          </svg>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
        {metrics.slice(0, 4).map((m) => (
          <div key={m.label} className="p-3 rounded-2xl bg-surface-container text-center font-headline">
            <span className="text-[11px] text-on-surface-variant block font-bold truncate">{m.label}</span>
            <span className="text-lg font-extrabold text-on-surface">{m.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
