import React from 'react';
import { AuthNodesVisual } from './AuthNodesVisual';

interface AuthLayoutProps {
  children: React.ReactNode;
  onNavigateHome?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onNavigateHome }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
      {/* Top Floating Return Action */}
      {onNavigateHome && (
        <button
          onClick={onNavigateHome}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-capsule hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface transition-all shadow-sm group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span>RETURN TO CAMPUS</span>
        </button>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Branding & Animated Talent Network */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between h-full min-h-[580px] p-6 rounded-3xl glass-identity-card border border-outline-variant relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-cyan-glow flex items-center justify-center">
              <div className="w-full h-full bg-space-black rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-cyan-400 text-xl font-bold">hub</span>
              </div>
            </div>
            <div>
              <span className="font-headline font-extrabold text-on-surface tracking-wider text-base block">
                PROJECTMATCH
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold block -mt-0.5">
                AI TEAM ARCHITECT
              </span>
            </div>
          </div>

          <AuthNodesVisual />

          <div className="flex items-center justify-between text-[11px] font-headline text-on-surface-variant pt-4 border-t border-outline-variant/40 relative z-10">
            <span>SRM INNOVATION GRID</span>
            <span className="flex items-center gap-1 text-mint-accent font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-accent animate-pulse" />
              TALENT NETWORK ACTIVE
            </span>
          </div>
        </div>

        {/* Right Side: Frosted Glass Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="glass-identity-card rounded-3xl p-6 sm:p-10 border border-cyan-400/30 shadow-2xl relative overflow-hidden animate-fadeIn">
            {/* Luminous top accent line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
