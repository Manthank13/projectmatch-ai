import React, { useState } from 'react';
import { TeamArchitectResult, Student } from '../../types';
import { CandidateCard } from './CandidateCard';
import { HiddenValueSpotlight } from './HiddenValueSpotlight';
import { NearMissCard } from './NearMissCard';
import { TeamDNAGraph } from './TeamDNAGraph';
import { WhyThisTeamModal } from '../modals/WhyThisTeamModal';
import confetti from 'canvas-confetti';

interface ArchitectDashboardProps {
  result: TeamArchitectResult;
  onReArchitect: () => void;
  onSelectStudent: (student: Student) => void;
}

export const ArchitectDashboard: React.FC<ArchitectDashboardProps> = ({
  result,
  onReArchitect,
  onSelectStudent
}) => {
  const [lockedIn, setLockedIn] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const handleLockIn = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    setLockedIn(true);
    setTimeout(() => setLockedIn(false), 4000);
  };

  const { extractedRequirements } = result;

  // Extract distinct departments in team
  const squadDepartments = Array.from(new Set(result.team.map(m => m.department.split('-')[0].trim())));

  return (
    <div className="space-y-12 py-8 animate-fadeIn">
      {/* Hero Match Header Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-5 pt-4">
        <div className="px-5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-headline text-xs font-bold flex items-center gap-1.5 shadow-cyan-glow">
          <span className="material-symbols-outlined text-base">auto_awesome</span>
          <span>✦ LIVE GEMINI AI SQUAD SYNTHESIS COMPLETE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
          YOUR DREAM TEAM ✨
        </h1>

        {/* Dynamic Synergy Fit Bento Pod */}
        <div className="glass-identity-card rounded-3xl p-6 sm:p-8 w-full relative overflow-hidden shadow-2xl border border-cyan-400/30">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl font-headline font-extrabold text-cyan-400 leading-none">
                {result.teamFit}%
              </span>
              <span className="text-xs sm:text-sm font-headline font-bold text-on-surface-variant mt-1.5">
                SYNERGY FIT
              </span>
            </div>

            <div className="hidden sm:block w-px h-20 bg-outline-variant/60" />

            <div className="text-center sm:text-left max-w-sm space-y-2">
              <h3 className="text-base sm:text-lg font-headline font-bold text-on-surface">
                {result.projectName}
              </h3>
              <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed line-clamp-3">
                {result.projectDescription}
              </p>

              <button
                onClick={() => setShowWhyModal(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-headline font-extrabold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span>✦ WHY THIS TEAM?</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cross-Department Match Highlight Banner */}
        {squadDepartments.length > 1 && (
          <div className="w-full p-4 rounded-3xl glass-identity-card border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-400/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-xl">hub</span>
              </div>
              <div>
                <span className="text-xs font-headline font-bold text-violet-300 uppercase block">
                  ✦ CROSS-DEPARTMENT MATCH DETECTED
                </span>
                <p className="text-xs font-body text-on-surface-variant">
                  Best complementary match synthesized across {squadDepartments.join(' + ')}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30 text-[11px] font-headline font-bold whitespace-nowrap">
              Interdisciplinary Synergy ✓
            </span>
          </div>
        )}
      </section>

      {/* Extracted Requirements Chips Bar */}
      <section className="glass-identity-card rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4 text-xs font-headline font-bold text-cyan-400 uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">fact_check</span>
          <span>GEMINI EXTRACTED PROJECT REQUIREMENTS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-headline">
          {/* Required Skills */}
          <div className="p-3.5 rounded-2xl glass-input border border-outline-variant/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              MANDATORY CAPABILITIES
            </span>
            <div className="flex flex-wrap gap-1">
              {extractedRequirements.requiredSkills.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="p-3.5 rounded-2xl glass-input border border-outline-variant/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              PREFERRED CAPABILITIES
            </span>
            <div className="flex flex-wrap gap-1">
              {extractedRequirements.preferredSkills.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-400/30 text-violet-300 text-[11px] font-bold">
                  + {s}
                </span>
              ))}
            </div>
          </div>

          {/* Team Size */}
          <div className="p-3.5 rounded-2xl glass-input border border-outline-variant/40 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              SQUAD SIZE
            </span>
            <span className="text-2xl font-extrabold text-on-surface">
              {extractedRequirements.teamSize} <span className="text-xs font-normal text-on-surface-variant">MEMBERS</span>
            </span>
          </div>

          {/* Minimum Availability */}
          <div className="p-3.5 rounded-2xl glass-input border border-outline-variant/40 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              MINIMUM AVAILABILITY
            </span>
            <span className="text-2xl font-extrabold text-mint-accent">
              {extractedRequirements.minAvailability} <span className="text-xs font-normal text-on-surface-variant">HOURS/WEEK</span>
            </span>
          </div>
        </div>
      </section>

      {/* Bento Grid: 4 Candidate Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-headline font-extrabold text-on-surface">
            The Lineup ({result.team.length} Members)
          </h2>
          <span className="text-xs font-headline text-on-surface-variant">
            Click candidate card for full portfolio dossier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {result.team.map((student) => (
            <CandidateCard
              key={student.id}
              student={student}
              onSelectStudent={onSelectStudent}
            />
          ))}
        </div>
      </section>

      {/* Insights Bento Block: Hidden Team Value + Near Miss */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HiddenValueSpotlight
            hiddenGem={result.hiddenGem}
            onSelectStudent={onSelectStudent}
          />
        </div>

        <div>
          <NearMissCard
            nearMiss={result.nearMiss}
            onSelectStudent={onSelectStudent}
          />
        </div>
      </section>

      {/* Team DNA Topology */}
      <section>
        <TeamDNAGraph metrics={result.teamDNA} />
      </section>

      {/* Action Footer Bar */}
      <section className="flex flex-wrap items-center justify-center gap-4 py-4">
        <button
          onClick={onReArchitect}
          className="px-8 py-3.5 rounded-full glass-button hover:bg-white/[0.08] text-on-surface font-headline text-xs font-bold transition-all shadow-sm"
        >
          Adjust Parameters
        </button>

        <button
          onClick={() => setShowWhyModal(true)}
          className="px-8 py-3.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-headline text-xs font-bold transition-all shadow-cyan-glow flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">psychology</span>
          <span>Why This Team?</span>
        </button>

        <button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-outline-variant text-on-surface-variant font-headline text-xs font-bold transition-all flex items-center gap-1.5"
          title="Toggle AI Debug Inspector"
        >
          <span className="material-symbols-outlined text-base">terminal</span>
          <span>{showDebugPanel ? 'Hide AI Inspector' : 'AI Inspector'}</span>
        </button>

        <button
          onClick={handleLockIn}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-violet-600 to-cyan-400 text-space-black font-headline text-xs font-extrabold hover:scale-105 active:scale-95 transition-all shadow-cyan-glow flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{lockedIn ? 'SQUAD LOCKED IN! ✨' : 'LOCK IN TEAM'}</span>
        </button>
      </section>

      {/* Developer AI Debug Inspector Panel */}
      {showDebugPanel && (
        <section className="p-6 rounded-3xl glass-identity-card border border-cyan-400/40 space-y-4 animate-fadeIn font-mono text-xs text-on-surface">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="material-symbols-outlined text-base">bug_report</span>
              <span>PROJECTMATCH LIVE GEMINI AI INSPECTOR</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">MODEL: GEMINI 2.5 / 3.6 FLASH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-space-surface border border-outline-variant space-y-2">
              <span className="text-cyan-300 font-bold block">1. USER INPUT & EXTRACTED BRIEF:</span>
              <p className="text-[11px] text-on-surface-variant">{result.projectDescription}</p>
              <div className="pt-2 border-t border-outline-variant/40 space-y-1 text-[11px]">
                <div><strong>Extracted Title:</strong> {result.projectName}</div>
                <div><strong>Mandatory Skills:</strong> {extractedRequirements.requiredSkills.join(', ')}</div>
                <div><strong>Preferred Skills:</strong> {extractedRequirements.preferredSkills.join(', ')}</div>
                <div><strong>Target Domain:</strong> {extractedRequirements.mandatoryDomain}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-space-surface border border-outline-variant space-y-2">
              <span className="text-violet-300 font-bold block">2. HYBRID SCORING & SQUAD ROSTER:</span>
              <div className="space-y-1 text-[11px]">
                <div><strong>Calculated Team Synergy:</strong> {result.teamFit}%</div>
                <div><strong>Mandatory Skill Coverage:</strong> {result.mandatoryCoverage}%</div>
                <div><strong>Squad Members:</strong></div>
                <ul className="list-disc pl-4 space-y-0.5 text-on-surface-variant">
                  {result.team.map(m => (
                    <li key={m.id}>
                      <strong className="text-on-surface">{m.name}</strong> ({m.department}) — {m.role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why This Team Explanation Modal */}
      <WhyThisTeamModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        result={result}
      />
    </div>
  );
};
