import React from 'react';
import { ProfessionalLinks } from '../../types';

interface ProfileLinksProps {
  links?: ProfessionalLinks;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileLinks: React.FC<ProfileLinksProps> = ({ links, size = 'sm', className = '' }) => {
  if (!links) return null;

  const activeLinks = [
    { key: 'github', url: links.github, icon: 'terminal', label: 'GitHub', color: 'hover:text-cyan-300' },
    { key: 'linkedin', url: links.linkedin, icon: 'work', label: 'LinkedIn', color: 'hover:text-violet-300' },
    { key: 'portfolio', url: links.portfolio, icon: 'language', label: 'Portfolio', color: 'hover:text-mint-accent' },
    { key: 'leetcode', url: links.leetcode, icon: 'code', label: 'LeetCode', color: 'hover:text-amber-300' },
    { key: 'kaggle', url: links.kaggle, icon: 'analytics', label: 'Kaggle', color: 'hover:text-sky-300' },
    { key: 'behance', url: links.behance, icon: 'palette', label: 'Behance', color: 'hover:text-pink-300' },
    { key: 'dribbble', url: links.dribbble, icon: 'brush', label: 'Dribbble', color: 'hover:text-rose-300' },
    { key: 'scholar', url: links.scholar, icon: 'school', label: 'Google Scholar', color: 'hover:text-blue-300' },
    { key: 'youtube', url: links.youtube, icon: 'smart_display', label: 'YouTube', color: 'hover:text-red-400' },
  ].filter(item => Boolean(item.url && item.url.trim()));

  if (activeLinks.length === 0) return null;

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  }[size];

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[size];

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {activeLinks.map(item => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          title={`Open ${item.label} Profile`}
          className={`${sizeClasses} rounded-xl glass-input hover:bg-white/[0.08] text-on-surface-variant ${item.color} transition-all duration-200 shadow-sm flex items-center justify-center`}
        >
          <span className={`material-symbols-outlined ${iconSizes}`}>{item.icon}</span>
        </a>
      ))}
    </div>
  );
};
