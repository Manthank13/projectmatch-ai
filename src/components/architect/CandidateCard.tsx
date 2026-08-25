import React from 'react';
import { Student } from '../../types';

interface CandidateCardProps {
  student: Student;
  onSelectStudent: (student: Student) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  student,
  onSelectStudent
}) => {
  const photoSrc = student.profileImage || student.avatar;
  const isRealPhoto = !!student.profileImage;

  return (
    <div
      onClick={() => onSelectStudent(student)}
      className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Fit Score Badge */}
      <div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-headline font-bold shadow-sm">
        {student.individualFitScore || 92}% Fit
      </div>

      {/* Avatar / Real Photo */}
      <div className="relative w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-surface shadow-soft group-hover:scale-105 transition-transform bg-surface flex-shrink-0">
        <img
          src={photoSrc}
          alt={student.name}
          className="w-full h-full object-cover"
        />
        {isRealPhoto && (
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface" title="Real Photo" />
        )}
      </div>

      {/* Name & Role */}
      <h3 className="text-xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">
        {student.name}
      </h3>
      <p className="text-xs font-headline font-bold text-tertiary mt-0.5 truncate max-w-[200px]">
        {student.department.split('-')[0]} • {student.role}
      </p>

      {/* Witty Personality Line */}
      <p className="text-xs font-body text-on-surface-variant italic mt-3 mb-3 min-h-[36px] line-clamp-2 px-2">
        "{student.personalityLine}"
      </p>

      {/* Proof of Work Chip */}
      <div className="mb-3 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-headline font-bold flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px]">verified</span>
        <span>{student.proofOfWorkScore || 91}% Proof of Work</span>
      </div>

      {/* Skills Chips */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {student.skills.slice(0, 3).map(sk => (
          <span
            key={sk.name}
            className="glass-pill text-on-surface text-[11px] font-headline font-bold px-2.5 py-1 rounded-full"
          >
            {sk.name}
          </span>
        ))}
      </div>

      {/* Unique Contribution / Marginal Value */}
      {student.uniqueContribution && (
        <div className="w-full mb-3 p-2 rounded-2xl glass-input text-xs font-body text-on-surface border border-outline-variant/40">
          <span className="font-bold text-primary">Role Value:</span> {student.uniqueContribution}
        </div>
      )}

      {/* Footer Availability */}
      <div className="w-full mt-auto pt-3 border-t border-outline-variant/40 flex justify-between items-center text-xs font-headline text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
          <span>{student.availabilityHours} hrs/wk</span>
        </span>
        <span className="text-primary font-bold hover:underline flex items-center gap-0.5">
          <span>Dossier</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </span>
      </div>
    </div>
  );
};
