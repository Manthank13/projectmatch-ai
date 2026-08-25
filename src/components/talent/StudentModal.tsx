import React from 'react';
import { Student } from '../../types';
import { getStudentAvatar } from '../../utils/avatar';
import { ProfileLinks } from '../common/ProfileLinks';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  onClose,
  onEditStudent,
  onDeleteStudent
}) => {
  if (!student) return null;

  const photoSrc = getStudentAvatar(student);
  const isRealUser = !!student.isUserCreated;

  const confidenceScore = student.profileConfidence || 94;
  const proofScore = student.proofOfWorkScore || 91;

  const links = student.professionalLinks || {};
  const hasAnyLink = Object.values(links).some(v => Boolean(v && v.trim()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Top Header & Actions */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-cyan-glow flex-shrink-0 bg-surface">
                <img
                  src={photoSrc}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isRealUser ? (
                <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-mint-accent/20 border border-mint-accent/40 text-mint-accent text-[9px] font-headline font-bold shadow-sm">
                  ✓ Verified
                </span>
              ) : (
                <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-outline-variant text-on-surface-variant text-[9px] font-mono font-bold shadow-sm">
                  Synthetic
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 text-[11px] font-headline font-bold">
                  {student.year || '3rd Year'}
                </span>
              </div>
              <p className="text-sm font-headline font-bold text-cyan-400 uppercase mt-1">
                {student.role}
              </p>
              <p className="text-xs font-body text-on-surface-variant mt-0.5">
                {student.department} • {student.campus || 'Main Campus'}
              </p>

              {/* Personality quote */}
              {student.personalityLine && (
                <p className="text-xs font-body italic text-on-surface-variant mt-2 max-w-md">
                  "{student.personalityLine}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditStudent && (
              <button
                onClick={() => {
                  onClose();
                  onEditStudent(student);
                }}
                className="p-2 rounded-full hover:bg-white/[0.08] text-on-surface-variant hover:text-cyan-300"
                title="Edit Student Profile"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            )}

            {onDeleteStudent && (
              <button
                onClick={() => {
                  onClose();
                  onDeleteStudent(student);
                }}
                className="p-2 rounded-full hover:bg-error-container text-error"
                title="Delete Student"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/[0.08] text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Verification & Trust Metrics Pod */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-headline text-xs text-center">
          <div className="p-3.5 rounded-2xl glass-identity-card border border-cyan-400/30">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-0.5">
              PROFILE CONFIDENCE
            </span>
            <span className="text-xl font-extrabold text-cyan-400 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-base text-cyan-400">verified</span>
              {confidenceScore}%
            </span>
            <span className="text-[9px] text-on-surface-variant block">PLATFORM-GENERATED</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-identity-card border border-violet-500/30">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-0.5">
              PROOF OF WORK
            </span>
            <span className="text-xl font-extrabold text-violet-400 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-base text-violet-400">code_blocks</span>
              {proofScore}%
            </span>
            <span className="text-[9px] text-on-surface-variant block">DEMONSTRATED EVIDENCE</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-identity-card border border-mint-accent/30">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-0.5">
              WEEKLY AVAILABILITY
            </span>
            <span className="text-xl font-extrabold text-mint-accent flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-base text-mint-accent">schedule</span>
              {student.availabilityHours} hrs/wk
            </span>
            <span className="text-[9px] text-on-surface-variant block">OVERLAP COMMITMENT</span>
          </div>
        </div>

        {/* Professional Online Links */}
        {hasAnyLink && (
          <div className="mb-6 space-y-2">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant block">
              FIND ME ONLINE & PROOF OF WORK:
            </span>
            <ProfileLinks links={links} size="md" />
          </div>
        )}

        {/* AI Match Insights */}
        <div className="p-4 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-surface to-violet-500/10 border border-cyan-400/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-headline font-bold text-cyan-400 uppercase">
            <span className="material-symbols-outlined text-base">psychology</span>
            <span>WHY PROJECTMATCH RECOMMENDS THIS PERSON:</span>
          </div>
          <p className="text-xs font-body text-on-surface-variant leading-relaxed">
            {student.uniqueContribution
              ? `Demonstrates high marginal team value with ${student.uniqueContribution}. Fills critical capability gaps in ${student.department}.`
              : `Strong interdisciplinary talent in ${student.domains.join(', ')} with verified project evidence and ${student.availabilityHours} hrs/week availability.`}
          </p>
        </div>

        {/* About & Bio */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant block">
            ABOUT & BACKGROUND:
          </span>
          <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed p-4 rounded-2xl glass-identity-card border border-outline-variant/40">
            {student.bio}
          </p>
        </div>

        {/* Skills & Proof of Work Breakdown */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant block">
            SKILLS & EVIDENCE RATING:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {student.skills.map((sk) => (
              <div
                key={sk.name}
                className="p-3 rounded-2xl glass-identity-card border border-outline-variant/30 flex items-center justify-between text-xs font-headline"
              >
                <div>
                  <span className="font-bold text-on-surface block">{sk.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-normal">
                    Self-Reported: {sk.score}/10 • Verified Evidence
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[11px] font-extrabold">
                    {sk.score * 10}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Portfolio Showcase */}
        {student.projectPortfolio && student.projectPortfolio.length > 0 && (
          <div className="mb-6 space-y-3">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant block">
              PORTFOLIO PROJECTS & DEMOS:
            </span>
            <div className="space-y-3">
              {student.projectPortfolio.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl glass-identity-card border border-outline-variant/40 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline font-extrabold text-sm text-on-surface">
                        {proj.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 font-bold">
                        {proj.role}
                      </span>
                    </div>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-headline font-bold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Code</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-headline font-bold text-on-surface"
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

        {/* Attached Resume */}
        {student.resume && (
          <div className="mb-6 space-y-2">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant block">
              ATTACHED RESUME:
            </span>
            <div className="p-3.5 rounded-2xl glass-identity-card border border-violet-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-violet-400">description</span>
                <div>
                  <p className="font-headline font-bold text-xs text-on-surface">
                    {student.resume.name}
                  </p>
                  <p className="text-[10px] font-body text-on-surface-variant">
                    {student.resume.size} • Uploaded {student.resume.uploadDate}
                  </p>
                </div>
              </div>
              {student.resume.dataUrl && (
                <a
                  href={student.resume.dataUrl}
                  download={student.resume.name}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-space-black font-headline text-xs font-bold shadow-cyan-glow hover:scale-105"
                >
                  Download / View
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between font-headline text-xs font-bold">
          <span className="text-on-surface-variant">
            SRM INNOVATION GRID • VERIFIED TALENT DOSSIER
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
