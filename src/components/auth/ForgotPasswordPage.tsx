import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid university email.');
      return;
    }

    const success = await forgotPassword(email);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout onNavigateHome={() => onNavigate('architect')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-headline font-bold">
            <span className="material-symbols-outlined text-sm">lock_reset</span>
            <span>CREDENTIAL RECOVERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            Reset your password.
          </h2>
          <p className="text-xs font-body text-on-surface-variant">
            Enter your university email and we will send you a secure link to reset your account password.
          </p>
        </div>

        {/* Error Feedback */}
        {displayError && (
          <div className="p-3.5 rounded-2xl bg-error-container border border-error/40 text-on-error-container text-xs font-headline flex items-center gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-base text-error flex-shrink-0">error</span>
            <span>{displayError}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-5 text-center animate-fadeIn py-2">
            <div className="w-16 h-16 rounded-full bg-mint-accent/15 border border-mint-accent/30 text-mint-accent mx-auto flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-headline font-extrabold text-on-surface">
                RESET LINK DISPATCHED
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                We've sent password reset instructions to <strong className="text-cyan-400">{email}</strong>.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('reset-password')}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>ENTER NEW PASSWORD →</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                University Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@srm.edu.in"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs font-headline text-on-surface placeholder:text-on-surface-variant/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-space-black border-t-transparent animate-spin" />
                  <span>DISPATCHING LINK...</span>
                </>
              ) : (
                <>
                  <span>SEND RESET LINK →</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
