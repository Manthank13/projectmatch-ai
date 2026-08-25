import React from 'react';
import { Student } from '../../types';
import { getStudentAvatar } from '../../utils/avatar';
import { ProfileLinks } from '../common/ProfileLinks';

interface CandidateCardProps {
  student: Student;
  onSelectStudent: (student: Student) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  student,
  onSelectStudent
}) => {
  const photoSrc = getStudentAvatar(student);
  const isRealUser = !!student.isUserCreated;

  return (
    <div
      onClick={() => onSelectStudent(student)}
      className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative group hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full justify-between"
    >
      {/* Top badges */}
      <div className="w-full flex items-center justify-between gap-2 mb-3">
        {isRealUser ? (
          <span className="px-2 py-0.5 rounded-full bg-mint-accent/15 border border-mint-accent/30 text-mint-accent text-[9px] font-headline font-extrabold">
            VERIFIED
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-outline-variant text-on-surface-variant text-[9px] font-mono font-bold">
            SYNTHETIC
          </span>
        )}

        <div className="bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 px-2.5 py-0.5 rounded-full text-xs font-headline font-extrabold shadow-sm">
          {student.individualFitScore || 92}% Fit
        </div>
      </div>

      <div>
        {/* Avatar / Real Photo */}
        <div className="relative w-20 h-20 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-cyan-400/40 shadow-cyan-glow group-hover:scale-105 transition-transform bg-surface flex-shrink-0">
          <img
            src={photoSrc}
            alt={student.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Role */}
        <h3 className="text-lg font-headline font-extrabold text-on-surface group-hover:text-cyan-300 transition-colors truncate max-w-[200px] mx-auto">
          {student.name}
        </h3>
        <p className="text-xs font-headline font-bold text-cyan-400 mt-0.5 truncate max-w-[200px] mx-auto">
          {student.department.split('-')[0]} • {student.role}
        </p>

        {/* Personality Line */}
        <p className="text-xs font-body text-on-surface-variant italic mt-2.5 mb-3 min-h-[36px] line-clamp-2 px-2">
          "{student.personalityLine}"
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {student.skills.slice(0, 3).map(sk => (
            <span
              key={sk.name}
              className="skill-capsule text-on-surface text-[11px] font-headline font-bold px-2.5 py-1 rounded-full"
            >
              {sk.name}
            </span>
          ))}
        </div>

        {/* Profile Links */}
        <div className="flex justify-center mb-3">
          <ProfileLinks links={student.professionalLinks} size="sm" />
        </div>

        {/* Unique Contribution */}
        {student.uniqueContribution && (
          <div className="w-full mb-3 p-2.5 rounded-2xl glass-input text-xs font-body text-on-surface border border-outline-variant/40 text-left">
            <span className="font-bold text-cyan-400">Role Proof:</span> {student.uniqueContribution}
          </div>
        )}
      </div>

      {/* Footer Availability */}
      <div className="w-full mt-auto pt-3 border-t border-outline-variant/40 flex justify-between items-center text-xs font-headline text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-cyan-400">schedule</span>
          <span>{student.availabilityHours} hrs/wk</span>
        </span>
        <span className="text-cyan-400 font-extrabold group-hover:underline flex items-center gap-0.5">
          <span>Dossier</span>
          <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
        </span>
      </div>
    </div>
  );
};
