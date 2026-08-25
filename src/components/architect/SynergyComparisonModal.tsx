import React from 'react';
import { X, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Zap, Trophy, Cpu } from 'lucide-react';
import { playClickSound } from '../../utils/sound';

interface SynergyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SynergyComparisonModal: React.FC<SynergyComparisonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl p-1 bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta shadow-cyan-glow">
        <div className="rounded-[22px] bg-cyber-bg/95 backdrop-blur-2xl border border-white/[0.1] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-cyber-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-white">
                  GREEDY SELECTION VS. PROJECTMATCH ARCHITECT
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Proof of algorithmic superiority in multi-agent team formation
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-cyber-surface hover:bg-cyber-cyan/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Column 1: Traditional Greedy Algorithm */}
            <div className="rounded-2xl p-5 bg-rose-950/20 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                    CONVENTIONAL APPROACH
                  </span>
                  <h4 className="text-base font-bold text-white font-mono">
                    Top-K Individual Fit (Greedy)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                  FAILS
                </span>
              </div>

              {/* Roster */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[11px] text-slate-400 block">Selected by Raw Individual Score:</span>
                <div className="p-2 rounded-lg bg-cyber-card/60 border border-white/[0.05] flex justify-between">
                  <span>1. Karthik Suresh (AI 94%)</span>
                  <span className="text-rose-400">Over-allocated (7h commit)</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card/60 border border-white/[0.05] flex justify-between">
                  <span>2. Aarav Menon (AI 92%)</span>
                  <span className="text-slate-400">Redundant CV/ML</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card/60 border border-white/[0.05] flex justify-between">
                  <span>3. Devansh Kapoor (AI 90%)</span>
                  <span className="text-slate-400">Redundant Robotics</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card/60 border border-white/[0.05] flex justify-between">
                  <span>4. Priya Sharma (NLP 89%)</span>
                  <span className="text-slate-400">Redundant Text AI</span>
                </div>
              </div>

              {/* Fatal Vulnerability */}
              <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500/40 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>3 Fatal Capability Gaps:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  0 Environmental Scientists • 0 Backend API Architects • 0 UI/UX Designers. 4 AI researchers build models that cannot connect to databases, understand ocean toxicology, or interface with users.
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs pt-2">
                <div className="p-2 rounded-lg bg-cyber-card">
                  <span className="text-slate-400 text-[10px] block">MANDATORY COVERAGE</span>
                  <span className="text-rose-400 font-bold text-lg">25%</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card">
                  <span className="text-slate-400 text-[10px] block">TEAM SYNERGY</span>
                  <span className="text-rose-400 font-bold text-lg">34%</span>
                </div>
              </div>
            </div>

            {/* Column 2: ProjectMatch Submodular Architecture */}
            <div className="rounded-2xl p-5 bg-cyber-surface/90 border border-cyber-cyan/50 space-y-4 shadow-cyan-glow">
              <div className="flex items-center justify-between border-b border-cyber-cyan/30 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyber-cyan font-bold block">
                    PROJECTMATCH ENGINE
                  </span>
                  <h4 className="text-base font-bold text-white font-mono">
                    Submodular Capability Architecture
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyber-cyan text-black font-mono text-xs font-extrabold">
                  OPTIMAL
                </span>
              </div>

              {/* Roster */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[11px] text-cyber-cyan block font-semibold">Architected Complementary Squad:</span>
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-cyan/30 flex justify-between">
                  <span className="text-white font-bold">1. Aarav Menon</span>
                  <span className="text-cyber-cyan">ML & Data Lead (15h)</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-cyan/30 flex justify-between">
                  <span className="text-white font-bold">2. Rohan Krishnan</span>
                  <span className="text-cyber-violet font-semibold">Backend & DB (12h)</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-emerald/40 flex justify-between">
                  <span className="text-white font-bold">3. Kavya Nair (Hidden Gem)</span>
                  <span className="text-cyber-emerald font-semibold">Marine Ecology (9h)</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-magenta/40 flex justify-between">
                  <span className="text-white font-bold">4. Ananya Iyer</span>
                  <span className="text-cyber-magenta font-semibold">Product & UX (10h)</span>
                </div>
              </div>

              {/* Advantage Box */}
              <div className="p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyber-cyan font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Mandatory Coverage:</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Every essential functional discipline is locked in with zero redundancy. High velocity from ideation to production deployment.
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs pt-2">
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-cyan/30">
                  <span className="text-slate-400 text-[10px] block">MANDATORY COVERAGE</span>
                  <span className="text-cyber-cyan font-bold text-lg">100%</span>
                </div>
                <div className="p-2 rounded-lg bg-cyber-card border border-cyber-cyan/30">
                  <span className="text-slate-400 text-[10px] block">TEAM SYNERGY</span>
                  <span className="text-cyber-cyan font-bold text-lg">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-black font-mono font-bold text-xs hover:brightness-110 transition-all shadow-cyan-glow"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
