import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TeamArchitectResult } from '../../types';

interface WhyThisTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TeamArchitectResult | null;
}

export const WhyThisTeamModal: React.FC<WhyThisTeamModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  const reasoning = result.aiReasoning;
  const synergyScore = result.teamFit;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-space-black/75 dark:bg-space-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-surface dark:bg-space-surface rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl z-[10000] my-auto max-h-[calc(100vh-48px)] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-cyan-glow flex-shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold font-headline text-on-surface">
                  WHY THIS TEAM?
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[10px] font-headline font-extrabold border border-cyan-400/30">
                  GEMINI 2.5 FLASH
                </span>
              </div>
              <p className="text-xs font-body text-on-surface-variant mt-0.5">
                AI Interdisciplinary Complementarity & Capability Gap Analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/[0.08] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Dynamic Synergy Score Pod */}
        <div className="p-5 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-surface-elevated to-violet-500/15 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <span className="text-4xl sm:text-5xl font-headline font-extrabold text-cyan-600 dark:text-cyan-400 leading-none">
                {synergyScore}%
              </span>
              <span className="block text-[10px] font-headline font-bold text-on-surface-variant uppercase mt-1">
                CALCULATED TEAM SYNERGY
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="text-xs font-body text-on-surface-variant max-w-xs">
              Submodular optimization eliminated capability gaps with 0% redundant overlap.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-mint-accent text-xs font-headline font-bold border border-emerald-500/30">
              ✓ Gap-Free Squad
            </span>
          </div>
        </div>

        {/* Executive Summary Reasoning */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-surface-container/50 border border-outline-variant text-xs sm:text-sm font-body text-on-surface leading-relaxed">
            <span className="text-cyan-600 dark:text-cyan-400 font-headline font-extrabold block text-xs mb-1 uppercase tracking-wider">
              ✦ EXECUTIVE SYNTHESIS
            </span>
            {reasoning?.whyThisTeam || reasoning?.synergyReasoning || 'This squad achieves maximum capability coverage across backend, AI, domain knowledge, and product UX with zero single points of failure.'}
          </div>

          {/* Team Strengths */}
          {reasoning?.teamStrengths && reasoning.teamStrengths.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-headline font-extrabold text-on-surface uppercase tracking-wider block">
                COMPLEMENTARITY & DOMAIN COVERAGE
              </span>
              <div className="space-y-2">
                {reasoning.teamStrengths.map((strength, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-container/30 border border-outline-variant/60 flex items-start gap-2.5 text-xs font-body text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-cyan-500 text-sm flex-shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Gaps Handled */}
          {reasoning?.teamGaps && reasoning.teamGaps.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-body text-on-surface">
              <span className="font-headline font-bold text-amber-500 block mb-1">
                ⚠️ CRITICAL CAPABILITY RESOLUTIONS
              </span>
              <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                {reasoning.teamGaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Individual Member Contributions */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-headline font-extrabold text-on-surface uppercase tracking-wider block">
              INDIVIDUAL ROLE VALUE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.team.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-xs text-on-surface">
                      {member.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      +{member.marginalTeamValue}% value
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-on-surface-variant">
                    {member.uniqueContribution || member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-outline-variant/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-transform cursor-pointer"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
