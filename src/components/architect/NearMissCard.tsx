import React from 'react';
import { Student } from '../../types';

interface NearMissCardProps {
  nearMiss: {
    student: Student;
    rejectionReason: string;
    constraintFailed: string;
    availableHours: number;
    requiredHours: number;
    technicalHighlights: string[];
  };
  onSelectStudent: (student: Student) => void;
}

export const NearMissCard: React.FC<NearMissCardProps> = ({
  nearMiss,
  onSelectStudent
}) => {
  const { student, availableHours, requiredHours, technicalHighlights } = nearMiss;
  const photoSrc = student.profileImage || student.avatar;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-outline-variant/60">
      <div>
        <div className="flex items-center gap-2 mb-6 text-outline font-headline font-bold text-xs tracking-wider">
          <span className="material-symbols-outlined text-base">warning</span>
          <span>ALMOST MADE THE SQUAD 😭</span>
        </div>

        <div 
          onClick={() => onSelectStudent(student)}
          className="flex items-center gap-4 mb-4 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all flex-shrink-0 bg-surface">
            <img
              src={photoSrc}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="font-headline font-extrabold text-on-surface text-lg group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            <p className="text-xs font-headline font-bold text-on-surface-variant">
              {student.department.split('-')[0]} • {student.role}
            </p>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {technicalHighlights.map(t => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md glass-input text-[10px] font-headline font-bold text-on-surface-variant"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Rejection Availability Explanation */}
      <div className="bg-error-container text-on-error-container p-4 rounded-2xl text-xs font-body leading-relaxed space-y-1">
        <div className="font-headline font-bold flex items-center justify-between">
          <span>Failed Availability Constraint:</span>
          <span>{availableHours}h &lt; {requiredHours}h/wk min</span>
        </div>
        <p className="opacity-90">
          "You're incredible. But the project needs {requiredHours} hours/week."
        </p>
      </div>
    </div>
  );
};
