import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Student } from '../../types';
import { StudentAvatar, getDepartmentColor } from '../common/StudentAvatar';
import { ProfileLinks } from '../common/ProfileLinks';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
  aiRecommendationReasoning?: string;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  onClose,
  onEditStudent,
  onDeleteStudent,
  aiRecommendationReasoning
}) => {
  // Lock body scroll and register Escape key listener when modal is open
  useEffect(() => {
    if (!student) return;

    // Save original overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [student, onClose]);

  if (!student) return null;

  const isRealUser = Boolean(student.isUserCreated || student.isSyntheticDemo === false);
  const confidenceScore = student.profileConfidence || (isRealUser ? 98 : 94);
  const proofScore = student.proofOfWorkScore || 92;
  const deptColor = getDepartmentColor(student.department);

  const cleanDept = student.department.split('-')[0].trim();
  const yearText = student.year ? student.year.split('(')[0].trim() : '3rd Year';

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-student-name"
    >
      {/* Dimmed Blurred Backdrop (Click outside closes modal) */}
      <div
        className="fixed inset-0 bg-space-black/75 dark:bg-space-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Dossier Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-surface dark:bg-space-surface rounded-3xl p-6 sm:p-10 border border-cyan-400/30 dark:border-cyan-400/20 shadow-2xl z-[10000] my-auto max-h-[calc(100vh-48px)] overflow-y-auto space-y-8 animate-fadeIn"
      >
        {/* Luminous Top Accent Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* 1. Header Section: Identity, Actions & Close Button */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-outline-variant/60 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full sm:w-auto">
            {/* XL Profile Avatar with Department Glow Ring */}
            <StudentAvatar
              student={student}
              size="xl"
              showDepartmentRing={true}
              className="shadow-2xl"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2
                  id="dossier-student-name"
                  className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface"
                >
                  {student.name}
                </h2>

                {/* Identity Verification Badge */}
                {isRealUser ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-mint-accent text-[10px] font-headline font-extrabold">
                    ✓ VERIFIED IDENTITY
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-500/10 dark:bg-white/10 border border-outline-variant text-on-surface-variant text-[10px] font-mono font-bold">
                    SYNTHETIC DEMO
                  </span>
                )}
              </div>

              <p className="text-sm font-headline font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                {student.role}
              </p>

              <p className="text-xs font-body text-on-surface-variant">
                {cleanDept} · {yearText} • {student.campus || 'Main Campus (KTR)'}
              </p>

              {student.personalityLine && (
                <p className="text-xs font-body italic text-on-surface-variant/90 max-w-lg mt-2 pt-1 border-t border-outline-variant/40">
                  "{student.personalityLine}"
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons (Edit / Delete / Close) */}
          <div className="flex items-center gap-2 self-end sm:self-start">
            {onEditStudent && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditStudent(student);
                }}
                className="px-3.5 py-1.5 rounded-full glass-input hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit Student Profile"
              >
                <span className="material-symbols-outlined text-sm text-cyan-500">edit</span>
                <span>Edit</span>
              </button>
            )}

            {onDeleteStudent && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteStudent(student);
                }}
                className="p-2 rounded-full hover:bg-error-container text-error transition-colors cursor-pointer"
                title="Delete Candidate"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full glass-input hover:bg-white/[0.08] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              aria-label="Close Dossier"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* 2. Verification & Trust Metrics Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-headline text-center">
          <div className="p-4 rounded-2xl bg-surface-container/50 border border-cyan-400/30 flex flex-col justify-between">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              {isRealUser ? 'PROFILE CONFIDENCE' : 'DEMO CONFIDENCE'}
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
                {confidenceScore}%
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">MATCH</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container/50 border border-violet-400/30 flex flex-col justify-between">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              PROOF OF WORK SCORE
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                {proofScore}%
              </span>
              <span className="text-[10px] text-violet-500 font-bold">VERIFIED</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container/50 border border-emerald-400/30 flex flex-col justify-between">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              WEEKLY AVAILABILITY
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-mint-accent">
                {student.availabilityHours}
              </span>
              <span className="text-[10px] text-on-surface-variant font-bold">HRS / WEEK</span>
            </div>
          </div>
        </div>

        {/* 3. Find Me Online / Professional Links */}
        {student.professionalLinks && Object.values(student.professionalLinks).some(v => Boolean(v && v.trim())) && (
          <div className="space-y-2 p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/60">
            <span className="text-[10px] font-headline font-extrabold text-on-surface-variant uppercase tracking-wider block">
              FIND ME ONLINE & CODE REPOSITORIES
            </span>
            <ProfileLinks links={student.professionalLinks} size="md" />
          </div>
        )}

        {/* 4. Why ProjectMatch Recommends This Person */}
        <div className="p-5 rounded-2xl bg-surface-container/40 border border-cyan-400/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-lg">
                psychology
              </span>
              <h3 className="font-headline font-extrabold text-on-surface text-xs uppercase tracking-wider">
                WHY PROJECTMATCH RECOMMENDS THIS PERSON
              </h3>
            </div>

            {aiRecommendationReasoning ? (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-[9px] font-headline font-bold">
                AI-GENERATED ANALYSIS
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-600 dark:text-violet-300 text-[9px] font-headline font-bold">
                CAMPUS COMPATIBILITY ANALYSIS
              </span>
            )}
          </div>

          <p className="text-xs font-body text-on-surface leading-relaxed">
            {aiRecommendationReasoning ||
              student.uniqueContribution ||
              `${student.name} brings high-impact submodular capability in ${cleanDept}, resolving potential critical failure modes in technical architecture.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40 text-xs font-headline">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-cyan-500 text-sm">check_circle</span>
              <span><strong>Marginal Value:</strong> {student.marginalTeamValue || 88}% added synergy</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-emerald-500 text-sm">bolt</span>
              <span><strong>Key Contribution:</strong> {student.uniqueContribution || 'Full-Stack Execution'}</span>
            </div>
          </div>
        </div>

        {/* 5. About & Background */}
        {student.bio && (
          <div className="space-y-2">
            <h3 className="text-xs font-headline font-extrabold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-cyan-500 text-base">description</span>
              <span>ABOUT & BACKGROUND</span>
            </h3>
            <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/60">
              {student.bio}
            </p>
          </div>
        )}

        {/* 6. Skills & Visual Proficiency */}
        <div className="space-y-3">
          <h3 className="text-xs font-headline font-extrabold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-violet-500 text-base">psychology</span>
            <span>SKILLS & PROFICIENCY METRICS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {student.skills.map((skill) => {
              const scoreOutOfTen = Math.min(Math.max(skill.score, 1), 10);
              const barWidthPct = (scoreOutOfTen / 10) * 100;

              return (
                <div
                  key={skill.name}
                  className="p-3 rounded-2xl bg-surface-container/40 border border-outline-variant flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-headline">
                    <span className="font-bold text-on-surface">{skill.name}</span>
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
                      {scoreOutOfTen} / 10
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-outline-variant/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Project Portfolio (if available) */}
        {student.projectPortfolio && student.projectPortfolio.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-headline font-extrabold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-base">rocket_launch</span>
              <span>PROJECT PORTFOLIO</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.projectPortfolio.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-extrabold text-on-surface text-xs">
                      {proj.name}
                    </h4>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:text-cyan-400 text-xs flex items-center gap-0.5"
                        title="View GitHub Repository"
                      >
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    )}
                  </div>

                  <p className="text-[11px] font-body text-on-surface-variant leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-outline-variant text-[10px] font-mono text-on-surface-variant"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Education & Campus Information */}
        <div className="p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-headline text-center sm:text-left">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold block">DEPARTMENT</span>
            <span className="font-bold text-on-surface">{student.department}</span>
          </div>

          <div>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold block">CAMPUS LOCATION</span>
            <span className="font-bold text-on-surface">{student.campus || 'Main Campus'}</span>
          </div>

          <div>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold block">ACADEMIC STANDING</span>
            <span className="font-bold text-emerald-600 dark:text-mint-accent">
              {student.gpa ? `GPA ${student.gpa} / 10.0` : `${student.year || '3rd Year'} Active`}
            </span>
          </div>
        </div>

        {/* Footer Close Action */}
        <div className="flex items-center justify-end pt-4 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-surface-elevated hover:bg-slate-900/5 dark:hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface border border-outline-variant transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );

  // Render directly in root portal on document.body
  return createPortal(modalContent, document.body);
};
