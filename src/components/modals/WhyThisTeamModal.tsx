import React from 'react';
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
  if (!isOpen || !result) return null;

  const reasoning = result.aiReasoning;
  const synergyScore = result.teamFit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-identity-card rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-cyan-glow flex-shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold font-headline text-on-surface">
                  WHY THIS TEAM?
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-headline font-extrabold border border-cyan-400/30">
                  GEMINI 2.5 FLASH
                </span>
              </div>
              <p className="text-xs font-body text-on-surface-variant mt-0.5">
                AI Interdisciplinary Complementarity & Capability Gap Analysis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/[0.08] text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Dynamic Synergy Score Pod */}
        <div className="p-5 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-space-surface to-violet-500/15 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <span className="text-4xl sm:text-5xl font-headline font-extrabold text-cyan-400 leading-none">
                {synergyScore}%
              </span>
              <span className="block text-[10px] font-headline font-bold text-on-surface-variant uppercase mt-1">
                CALCULATED TEAM SYNERGY
              </span>
            </div>

            <div className="hidden sm:block w-px h-12 bg-outline-variant" />

            <div className="space-y-1 text-xs font-headline">
              <span className="text-on-surface font-bold block">
                Deterministic Hybrid Scoring:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-outline-variant text-cyan-300 font-bold">
                  ✓ 35% Mandatory Skills ({result.mandatoryCoverage}%)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-outline-variant text-violet-300 font-bold">
                  ✓ 20% Preferred Skills
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-outline-variant text-mint-accent font-bold">
                  ✓ 10% Cross-Dept Diversity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Synergy Reasoning Block */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-headline font-extrabold text-cyan-400 uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>GEMINI ARCHITECT QUALITATIVE ASSESSMENT:</span>
          </div>

          <div className="p-4 rounded-2xl bg-space-surface/90 border border-outline-variant text-xs font-body text-on-surface leading-relaxed space-y-2">
            <p>
              {reasoning?.synergyReasoning ||
                `This squad represents a mathematically balanced capability matrix. Rather than stacking redundant AI researchers, the engine paired deep machine learning with marine ecotoxicology and high-throughput distributed APIs to eliminate critical project risks.`}
            </p>
            {reasoning?.whyThisTeam && (
              <p className="pt-2 border-t border-outline-variant/30 text-on-surface-variant">
                <strong className="text-cyan-300">Key Rationale:</strong> {reasoning.whyThisTeam}
              </p>
            )}
          </div>
        </div>

        {/* Member-by-Member Contributions */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-headline font-bold text-on-surface uppercase tracking-wider block">
            INDIVIDUAL CAPABILITY CONTRIBUTIONS:
          </span>

          <div className="space-y-2">
            {result.team.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-2xl bg-white/[0.02] border border-outline-variant flex items-center justify-between text-xs font-headline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/40 bg-surface flex-shrink-0">
                    <img
                      src={member.profileImage || member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-on-surface block">{member.name}</span>
                    <span className="text-[10px] text-on-surface-variant font-normal">
                      {member.role} • {member.department.split('-')[0]}
                    </span>
                  </div>
                </div>

                <div className="text-right max-w-xs">
                  <span className="text-[11px] text-cyan-300 font-bold block">
                    {member.uniqueContribution || 'Eliminates critical capability gap in project architecture'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between font-headline text-xs font-bold">
          <span className="text-on-surface-variant text-[10px]">
            ENGINE: GOOGLE GEMINI 2.5 / 3.6 FLASH + DETERMINISTIC SCORER
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-space-black font-extrabold shadow-cyan-glow transition-all"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
