import React from 'react';
import { Student } from '../../types';

interface StudentAvatarProps {
  student: Student | Partial<Student> | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showDepartmentRing?: boolean;
}

// Department theme colors for deterministic accents
export function getDepartmentColor(department?: string): { hex: string; glow: string; text: string; bg: string } {
  const dept = (department || '').toUpperCase();
  if (dept.includes('AI') || dept.includes('MACHINE LEARNING')) {
    return { hex: '#00E5FF', glow: 'rgba(0, 229, 255, 0.4)', text: 'text-cyan-400', bg: 'bg-cyan-500/20' };
  }
  if (dept.includes('BIO') || dept.includes('GENETIC') || dept.includes('MARINE') || dept.includes('CHEM')) {
    return { hex: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  }
  if (dept.includes('DESIGN') || dept.includes('UX') || dept.includes('PRODUCT') || dept.includes('MEDIA')) {
    return { hex: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)', text: 'text-pink-400', bg: 'bg-pink-500/20' };
  }
  if (dept.includes('ROBOTICS') || dept.includes('MECH') || dept.includes('AEROSPACE')) {
    return { hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400', bg: 'bg-amber-500/20' };
  }
  if (dept.includes('ENVIRON') || dept.includes('CIVIL') || dept.includes('FORESTRY')) {
    return { hex: '#34D399', glow: 'rgba(52, 211, 153, 0.4)', text: 'text-teal-400', bg: 'bg-teal-500/20' };
  }
  if (dept.includes('ECE') || dept.includes('EEE') || dept.includes('ELECTR')) {
    return { hex: '#6366F1', glow: 'rgba(99, 102, 241, 0.4)', text: 'text-indigo-400', bg: 'bg-indigo-500/20' };
  }
  if (dept.includes('DATA') || dept.includes('QUANT') || dept.includes('MATH')) {
    return { hex: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)', text: 'text-sky-400', bg: 'bg-sky-500/20' };
  }
  // Default CSE / Software
  return { hex: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)', text: 'text-violet-400', bg: 'bg-violet-500/20' };
}

// Generate initials from student name (e.g. "Tony Stark" -> "TS")
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'PM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'md',
  className = '',
  showDepartmentRing = true
}) => {
  const deptColor = getDepartmentColor(student?.department);
  const initials = getInitials(student?.name);

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-28 h-28 text-2xl'
  }[size];

  // 1. Check if user has uploaded a custom image or avatarUrl
  const hasUserImage = Boolean(
    (student?.avatarUrl && student.avatarUrl.trim()) ||
    (student?.profileImage && student.profileImage.trim())
  );

  // 2. Check if it's a synthetic demo student with cartoon avatar
  const hasDemoAvatar = Boolean(
    (student?.avatar && student.avatar.trim() && (student.isSyntheticDemo !== false))
  );

  const imgSrc = student?.avatarUrl || student?.profileImage || (hasDemoAvatar ? student?.avatar : null);

  const ringStyle = showDepartmentRing
    ? { borderColor: deptColor.hex, boxShadow: `0 0 10px ${deptColor.glow}` }
    : undefined;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-surface border transition-all duration-300 ${sizeClasses} ${className}`}
      style={ringStyle}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={student?.name || 'Talent Avatar'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // If image fails to load, gracefully hide image to reveal fallback monogram
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        /* Deterministic Geometric Monogram Fallback for Real Users */
        <div
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden font-headline font-extrabold"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${deptColor.hex}33 0%, #080B12 100%)`
          }}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
          <span className="relative z-10 font-mono tracking-wider font-extrabold text-on-surface">
            {initials}
          </span>
          <span
            className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-space-black"
            style={{ backgroundColor: deptColor.hex }}
          />
        </div>
      )}
    </div>
  );
};
