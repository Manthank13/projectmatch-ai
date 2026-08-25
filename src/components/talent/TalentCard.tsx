import React from 'react';
import { Student } from '../../types';
import { StudentAvatar, getDepartmentColor } from '../common/StudentAvatar';
import { ProfileLinks } from '../common/ProfileLinks';

interface TalentCardProps {
  student: Student;
  onSelect: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  student,
  onSelect,
  onEdit,
  onDelete
}) => {
  const isRealUser = Boolean(student.isUserCreated || student.isSyntheticDemo === false);
  const proofScore = student.proofOfWorkScore || 92;
  const deptColor = getDepartmentColor(student.department);

  // Extract clean department name and year
  const cleanDept = student.department.split('-')[0].trim();
  const yearText = student.year ? student.year.split('(')[0].trim() : '3rd Year';

  return (
    <div
      onClick={() => onSelect(student)}
      className="glass-identity-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative group hover:-translate-y-1.5 transition-all duration-300 w-full min-w-0 border border-outline-variant hover:border-cyan-400/50 hover:shadow-cyan-glow cursor-pointer select-none"
    >
      <div>
        {/* Top Header: Avatar + Identity Meta */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Standardized Digital Passport Avatar */}
            <StudentAvatar
              student={student}
              size="md"
              showDepartmentRing={true}
              className="group-hover:scale-105 transition-transform"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-headline font-extrabold text-on-surface text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate max-w-[130px] sm:max-w-[150px]">
                  {student.name}
                </h3>

                {/* Identity Verification Badge */}
                {isRealUser ? (
                  <span
                    className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-mint-accent text-[9px] font-headline font-extrabold flex-shrink-0"
                    title="Verified University Identity"
                  >
                    VERIFIED
                  </span>
                ) : (
                  <span
                    className="px-1.5 py-0.5 rounded-md bg-slate-500/10 dark:bg-white/10 border border-outline-variant text-on-surface-variant text-[9px] font-mono font-bold flex-shrink-0"
                    title="Synthetic Demonstration Persona"
                  >
                    SYNTHETIC DEMO
                  </span>
                )}
              </div>

              {/* Role with Department Accent Color */}
              <p className="text-xs font-headline font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[160px] min-h-[18px] mt-0.5">
                {student.role}
              </p>

              {/* Department · Year */}
              <span className="text-[10px] font-body text-on-surface-variant block truncate max-w-[160px] min-h-[16px]">
                {cleanDept} · {yearText}
              </span>
            </div>
          </div>

          {/* Quick Edit/Delete Actions */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(student);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-on-surface-variant hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(student);
                  }}
                  className="p-1.5 rounded-lg hover:bg-error-container text-error transition-colors cursor-pointer"
                  title="Remove Profile"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Subtle Passport Hairline Divider */}
        <div className="h-px w-full bg-outline-variant/60 mb-4" />

        {/* Skills Section with Visual Proficiency Bars */}
        <div className="space-y-1.5 mb-4 min-h-[70px]">
          <span className="text-[10px] font-headline font-extrabold text-on-surface-variant uppercase tracking-wider block">
            SKILLS & PROFICIENCY
          </span>

          <div className="flex flex-wrap gap-1.5 items-start content-start">
            {student.skills.slice(0, 3).map((sk) => {
              const scoreOutOfTen = Math.min(Math.max(sk.score, 1), 10);
              const barWidthPct = (scoreOutOfTen / 10) * 100;

              return (
                <div
                  key={sk.name}
                  className="skill-capsule px-2.5 py-1 rounded-xl font-headline text-[11px] text-on-surface flex items-center gap-2 border border-outline-variant"
                >
                  <span className="font-bold truncate max-w-[85px]">{sk.name}</span>

                  {/* Micro Visual Meter Bar */}
                  <div className="w-8 h-1.5 bg-outline-variant/60 rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>

                  <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold text-[10px]">
                    {scoreOutOfTen}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Side-by-Side Metric Pods */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Proof / Verification Score Pod */}
          <div className="p-2.5 rounded-2xl bg-surface-elevated/50 border border-outline-variant flex flex-col justify-between">
            <span className="text-[9px] font-headline font-bold text-on-surface-variant uppercase tracking-wider">
              {isRealUser ? 'VERIFIED PROOF' : 'PROOF OF WORK'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-headline font-extrabold text-on-surface leading-none">
                {proofScore}%
              </span>
              <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                SCORE
              </span>
            </div>
          </div>

          {/* Availability Hours Pod */}
          <div className="p-2.5 rounded-2xl bg-surface-elevated/50 border border-outline-variant flex flex-col justify-between">
            <span className="text-[9px] font-headline font-bold text-on-surface-variant uppercase tracking-wider">
              AVAILABILITY
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-headline font-extrabold text-emerald-600 dark:text-mint-accent leading-none">
                {student.availabilityHours}
              </span>
              <span className="text-[9px] font-mono text-on-surface-variant font-bold">
                HRS / WK
              </span>
            </div>
          </div>
        </div>

        {/* Personality Line (if available) */}
        {student.personalityLine && (
          <p className="font-body text-xs text-on-surface-variant italic mb-3 min-h-[32px] line-clamp-2 leading-relaxed px-0.5">
            "{student.personalityLine}"
          </p>
        )}

        {/* Social Proof Links */}
        <div className="mb-2 h-7 flex items-center">
          <ProfileLinks links={student.professionalLinks} size="sm" />
        </div>
      </div>

      {/* Card Footer: Campus Location + View Dossier Action */}
      <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between font-headline text-xs mt-2 h-10">
        <span className="text-on-surface-variant text-[11px] truncate max-w-[120px]" title={student.campus}>
          {student.campus?.split('(')[0] || 'Main Campus'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(student);
          }}
          className="text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>VIEW DOSSIER</span>
          <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
