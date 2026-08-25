import React, { useEffect, useState } from 'react';

interface AnalysisSequenceProps {
  onComplete: () => void;
  isRealAIProcessing?: boolean;
}

const STAGES = [
  { id: 1, label: 'SCANNING PROJECT REQUIREMENTS...', icon: 'analytics', detail: 'Extracting mandatory & preferred technical capabilities via Gemini' },
  { id: 2, label: 'MAPPING CAMPUS TALENT MATRIX...', icon: 'hub', detail: 'Querying candidate availability, GitHub portfolios & verified proof-of-work' },
  { id: 3, label: 'MEASURING COMPLEMENTARITY...', icon: 'psychology', detail: 'Minimizing redundant overlap and identifying single points of failure' },
  { id: 4, label: 'OPTIMIZING INTERDISCIPLINARY FIT...', icon: 'group_add', detail: 'Synthesizing cross-department collaboration across engineering & domain science' },
  { id: 5, label: 'CALCULATING HYBRID SYNERGY MATRIX...', icon: 'tune', detail: 'Applying deterministic weighted scoring: 35% skills + 20% pref + 15% domain' },
  { id: 6, label: 'TEAM ARCHITECTED ✨', icon: 'auto_awesome', detail: 'AI squad synthesis complete with individual contribution proofs' }
];

export const AnalysisSequence: React.FC<AnalysisSequenceProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentStep < STAGES.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 550);
    } else {
      timeoutId = setTimeout(() => {
        onComplete();
      }, 600);
    }

    return () => clearTimeout(timeoutId);
  }, [currentStep, onComplete]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn relative z-10">
      <div className="glass-identity-card rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl border border-cyan-400/30">
        {/* Soft Background Pulse */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-cyan-400/30 border border-cyan-400/40 flex items-center justify-center shadow-cyan-glow mb-6 animate-pulse">
          <span className="material-symbols-outlined text-3xl text-cyan-400">psychology</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-headline font-bold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
          <span>GEMINI 2.5 FLASH • ACTIVE</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface mb-1">
          ARCHITECTING YOUR TEAM
        </h3>
        <p className="text-xs font-body text-on-surface-variant mb-6 max-w-md">
          Executing real-time submodular optimization & Gemini qualitative synergy modeling...
        </p>

        {/* Animated Stages Checklist */}
        <div className="w-full space-y-2.5 font-headline text-xs text-left">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                  isCompleted
                    ? 'bg-white/[0.02] border-outline-variant text-on-surface'
                    : isCurrent
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 font-bold border-cyan-400/50 shadow-cyan-glow scale-[1.01]'
                    : 'bg-white/[0.01] border-outline-variant/30 text-on-surface-variant/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-base ${isCurrent ? 'text-cyan-400' : ''}`}>{stage.icon}</span>
                  <div>
                    <span className="block font-bold">{stage.label}</span>
                    <span className={`text-[10px] font-body block ${isCurrent ? 'text-cyan-200/90' : 'text-on-surface-variant'}`}>
                      {stage.detail}
                    </span>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-cyan-400 text-sm font-bold">check_circle</span>
                  ) : isCurrent ? (
                    <span className="material-symbols-outlined animate-spin text-cyan-400 text-sm">sync</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-outline-variant block"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
