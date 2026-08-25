import React from 'react';
import { Student } from '../../types';
import { StudentAvatar, getDepartmentColor } from '../common/StudentAvatar';
import { ProfileLinks } from '../common/ProfileLinks';

interface CandidateCardProps {
  student: Student;
  onSelectStudent: (student: Student) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  student,
  onSelectStudent
}) => {
  const isRealUser = Boolean(student.isUserCreated || student.isSyntheticDemo === false);
  const deptColor = getDepartmentColor(student.department);
  const cleanDept = student.department.split('-')[0].trim();

  return (
    <div
      onClick={() => onSelectStudent(student)}
      className="glass-identity-card rounded-3xl p-6 flex flex-col items-center text-center relative group hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full justify-between border border-outline-variant hover:border-cyan-400/50 hover:shadow-cyan-glow select-none"
    >
      {/* Top Badges */}
      <div className="w-full flex items-center justify-between gap-2 mb-3">
        {isRealUser ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-mint-accent text-[9px] font-headline font-extrabold">
            ✓ VERIFIED
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-500/10 dark:bg-white/10 border border-outline-variant text-on-surface-variant text-[9px] font-mono font-bold">
            SYNTHETIC
          </span>
        )}

        <div className="bg-cyan-500/15 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 px-2.5 py-0.5 rounded-full text-xs font-headline font-extrabold shadow-sm">
          {student.individualFitScore || 92}% Fit
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Standardized Digital Passport Avatar */}
        <div className="mb-3">
          <StudentAvatar
            student={student}
            size="lg"
            showDepartmentRing={true}
            className="group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Name & Role */}
        <h3 className="text-base sm:text-lg font-headline font-extrabold text-on-surface group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate max-w-[200px] mx-auto">
          {student.name}
        </h3>
        <p className="text-xs font-headline font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 truncate max-w-[200px] mx-auto">
          {cleanDept} • {student.role}
        </p>

        {/* Personality Line */}
        {student.personalityLine && (
          <p className="text-xs font-body text-on-surface-variant italic mt-2.5 mb-3 min-h-[36px] line-clamp-2 px-2 leading-relaxed">
            "{student.personalityLine}"
          </p>
        )}

        {/* Skills Chips with Visual Scores */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {student.skills.slice(0, 3).map((sk) => {
            const scoreOutOfTen = Math.min(Math.max(sk.score, 1), 10);
            return (
              <span
                key={sk.name}
                className="skill-capsule text-on-surface text-[11px] font-headline font-bold px-2.5 py-1 rounded-full border border-outline-variant flex items-center gap-1.5"
              >
                <span>{sk.name}</span>
                <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold text-[10px]">
                  {scoreOutOfTen}
                </strong>
              </span>
            );
          })}
        </div>

        {/* Profile Links */}
        <div className="flex justify-center mb-3 h-7">
          <ProfileLinks links={student.professionalLinks} size="sm" />
        </div>

        {/* Unique Role Contribution */}
        {student.uniqueContribution && (
          <div className="w-full mb-3 p-2.5 rounded-2xl bg-surface-elevated/50 text-xs font-body text-on-surface border border-outline-variant/60 text-left">
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Role Synergy:</span>{' '}
            {student.uniqueContribution}
          </div>
        )}
      </div>

      {/* Footer Availability & Dossier CTA */}
      <div className="w-full mt-auto pt-3 border-t border-outline-variant/60 flex justify-between items-center text-xs font-headline text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-cyan-600 dark:text-cyan-400">
            schedule
          </span>
          <span>{student.availabilityHours} hrs/wk</span>
        </span>
        <span className="text-cyan-600 dark:text-cyan-400 font-extrabold group-hover:text-cyan-500 dark:group-hover:text-cyan-300 flex items-center gap-0.5">
          <span>VIEW DOSSIER</span>
          <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </span>
      </div>
    </div>
  );
};
