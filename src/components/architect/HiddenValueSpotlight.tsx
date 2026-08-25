import React, { useState } from 'react';
import { Student } from '../../types';

interface HiddenValueSpotlightProps {
  hiddenGem: {
    student: Student;
    individualFit: number;
    marginalTeamValue: number;
    capabilityEliminated: string;
    beforeCoverage: { skill: string; covered: boolean }[];
    afterCoverage: { skill: string; covered: boolean }[];
    explanation: string;
  };
  onSelectStudent: (student: Student) => void;
}

export const HiddenValueSpotlight: React.FC<HiddenValueSpotlightProps> = ({
  hiddenGem,
  onSelectStudent
}) => {
  const [showAfter, setShowAfter] = useState(true);
  const { student, individualFit, marginalTeamValue, capabilityEliminated, beforeCoverage, afterCoverage } = hiddenGem;

  const activeCoverage = showAfter ? afterCoverage : beforeCoverage;
  const photoSrc = student.profileImage || student.avatar;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-4 mb-6">
        <div className="flex items-center gap-2.5 text-primary">
          <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
          <div>
            <span className="text-xs font-headline font-bold uppercase tracking-wider block">
              ✦ CORE DISCOVERY & PARADOX
            </span>
            <h3 className="text-lg sm:text-xl font-headline font-extrabold text-on-surface">
              THE BEST PERSON ISN'T ALWAYS THE BEST TEAMMATE
            </h3>
          </div>
        </div>

        {/* Before / After Activator Toggle */}
        <div className="flex items-center p-1 rounded-full glass-input font-headline text-xs font-bold">
          <button
            type="button"
            onClick={() => setShowAfter(false)}
            className={`px-4 py-1.5 rounded-full transition-all ${
              !showAfter
                ? 'bg-error-container text-on-error-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            BEFORE ({student.name.split(' ')[0]} GONE)
          </button>
          <button
            type="button"
            onClick={() => setShowAfter(true)}
            className={`px-4 py-1.5 rounded-full transition-all ${
              showAfter
                ? 'bg-primary-container text-on-primary-container shadow-soft'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            AFTER ({student.name.split(' ')[0]} JOINED ✓)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Explanation & Progress Bars */}
        <div className="lg:col-span-8 space-y-6">
          <p className="text-sm font-body text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">{student.name}</strong> has a lower individual core fit (<strong className="text-on-surface">{individualFit}%</strong>) compared to generic AI researchers. However, her specialized domain expertise eliminates a fatal single point of failure in the project requirements, boosting <strong>total team capability value to {marginalTeamValue}%</strong>.
          </p>

          {/* Progress Comparison Bars */}
          <div className="space-y-4 font-headline text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-on-surface font-bold">Individual Core Fit (Linear Keyword Search)</span>
                <span className="text-on-surface-variant font-bold">{individualFit}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3.5 overflow-hidden p-0.5 border border-outline-variant/40">
                <div
                  className="bg-outline h-full rounded-full transition-all duration-700"
                  style={{ width: `${individualFit}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-primary font-bold">Marginal Team Value Added (Closed Critical Gap)</span>
                <span className="text-primary font-extrabold text-sm">{marginalTeamValue}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3.5 overflow-hidden p-0.5 border border-outline-variant/40">
                <div
                  className="bg-primary-container h-full rounded-full transition-all duration-700 shadow-soft"
                  style={{ width: `${marginalTeamValue}%` }}
                />
              </div>
            </div>
          </div>

          {/* Capability Matrix Grid */}
          <div className="p-4 rounded-2xl glass-panel border border-outline-variant/40 space-y-3">
            <span className="text-xs font-headline font-bold text-on-surface block uppercase">
              Mandatory Capability Matrix State:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeCoverage.map((cov) => (
                <div
                  key={cov.skill}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-headline font-bold transition-all ${
                    cov.covered
                      ? 'bg-surface border-outline-variant text-on-surface'
                      : 'bg-error-container text-on-error-container border-error animate-pulse'
                  }`}
                >
                  <span className="truncate max-w-[100px]">{cov.skill}</span>
                  <span className="material-symbols-outlined text-sm">
                    {cov.covered ? 'check_circle' : 'cancel'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Catalyst Character Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div 
            onClick={() => onSelectStudent(student)}
            className="w-44 h-44 rounded-full border-4 border-surface-variant flex items-center justify-center relative bg-surface-bright flex-shrink-0 cursor-pointer shadow-soft group hover:scale-105 transition-transform"
          >
            <img
              src={photoSrc}
              alt={student.name}
              className="w-40 h-40 rounded-full object-cover"
            />
            <div className="absolute -bottom-3 bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-xs font-headline font-bold border-2 border-surface-bright shadow-sm whitespace-nowrap">
              ✦ Catalyst Teammate
            </div>
          </div>

          <h4 className="font-headline font-extrabold text-on-surface text-base mt-4">
            {student.name}
          </h4>
          <p className="text-xs font-headline text-tertiary">
            {student.role}
          </p>
        </div>
      </div>
    </div>
  );
};
