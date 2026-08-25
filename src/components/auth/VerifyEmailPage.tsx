import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface VerifyEmailPageProps {
  onNavigate: (route: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate }) => {
  const { user, resendVerificationEmail, verifyEmail, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResend = async () => {
    if (!canResend) return;
    const success = await resendVerificationEmail();
    if (success) {
      setResendSuccess(true);
      setCanResend(false);
      setCountdown(60);
      setTimeout(() => setResendSuccess(false), 4000);
    }
  };

  const handleSimulateVerification = async () => {
    await verifyEmail();
    onNavigate('architect');
  };

  const userEmail = user?.email || 'your university email';

  return (
    <AuthLayout onNavigateHome={() => onNavigate('architect')}>
      <div className="space-y-6 text-center w-full">
        {/* Animated Glass Envelope Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center shadow-cyan-glow animate-float">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-cyan-600 dark:text-cyan-400">
              mark_email_read
            </span>
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 dark:bg-mint-accent border-2 border-surface animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-300 text-[11px] font-headline font-bold">
            <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
            <span>VERIFICATION DISPATCHED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            CHECK YOUR INBOX.
          </h2>
          <p className="text-xs sm:text-sm font-body text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            We've sent a verification link to <strong className="text-cyan-600 dark:text-cyan-400">{userEmail}</strong>. Please check your inbox and click the link to activate your talent profile.
          </p>
        </div>

        {/* Resend Success Alert */}
        {resendSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-mint-accent text-xs font-headline font-bold flex items-center justify-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Fresh verification link dispatched!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSimulateVerification}
            className="w-full h-12 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>I'VE VERIFIED MY EMAIL →</span>
          </button>

          <a
            href={`mailto:${userEmail}`}
            className="w-full h-12 px-6 rounded-2xl glass-input hover:bg-slate-900/5 dark:hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-cyan-600 dark:text-cyan-400">mail</span>
            <span>OPEN EMAIL CLIENT</span>
          </a>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-headline font-bold transition-all flex items-center justify-center gap-1.5 ${
              canResend
                ? 'text-cyan-600 dark:text-cyan-400 hover:underline hover:bg-cyan-500/10 cursor-pointer'
                : 'text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>{canResend ? 'RESEND EMAIL' : `RESEND EMAIL (${countdown}s)`}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-outline-variant">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            ← BACK TO LOGIN
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
