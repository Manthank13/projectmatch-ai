import React from 'react';
import { CheckCircle2, Award, Zap, Layers, Sparkles } from 'lucide-react';

interface CapabilityCoverageProps {
  coverage: {
    mandatory: { name: string; percentage: number; contributors: string[] }[];
    preferred: { name: string; percentage: number; contributors: string[] }[];
  };
}

export const CapabilityCoverage: React.FC<CapabilityCoverageProps> = ({ coverage }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Mandatory Capabilities */}
      <div className="rounded-2xl p-0.5 bg-gradient-to-b from-cyber-cyan/30 via-white/[0.05] to-transparent shadow-holo">
        <div className="rounded-[15px] bg-cyber-card/95 backdrop-blur-xl border border-cyber-cyan/30 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  MANDATORY CAPABILITIES
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 text-xs font-mono font-bold">
                100% COVERED
              </span>
            </div>

            <div className="space-y-4">
              {coverage.mandatory.map((item) => (
                <div key={item.name} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                      {item.name}
                    </span>
                    <span className="text-cyber-cyan font-bold">{item.percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-cyber-surface overflow-hidden p-0.5 border border-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-sky-400 shadow-cyan-glow transition-all duration-700"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {/* Contributors */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Filled by:</span>
                    <span className="text-slate-300 font-semibold">{item.contributors.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-cyber-cyan/90 flex items-center justify-between">
            <span>● 0 Fatal Capability Vulnerabilities</span>
            <span>CRITICAL PATH: CLEAR</span>
          </div>
        </div>
      </div>

      {/* Preferred Capabilities */}
      <div className="rounded-2xl p-0.5 bg-gradient-to-b from-cyber-violet/30 via-white/[0.05] to-transparent shadow-holo">
        <div className="rounded-[15px] bg-cyber-card/95 backdrop-blur-xl border border-cyber-violet/30 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-violet animate-pulse"></span>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  PREFERRED & VALUE-ADD CAPABILITIES
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyber-violet/15 text-cyber-violet border border-cyber-violet/30 text-xs font-mono font-bold">
                COMPLEMENTARY
              </span>
            </div>

            <div className="space-y-4">
              {coverage.preferred.map((item) => (
                <div key={item.name} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-cyber-violet font-bold">{item.percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-cyber-surface overflow-hidden p-0.5 border border-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyber-violet to-cyber-magenta shadow-violet-glow transition-all duration-700"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {/* Contributors */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Contributors:</span>
                    <span className="text-slate-300">{item.contributors.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-cyber-violet/90 flex items-center justify-between">
            <span>● Extended Synergy Multiplier</span>
            <span>+28% SPEED VELOCITY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
