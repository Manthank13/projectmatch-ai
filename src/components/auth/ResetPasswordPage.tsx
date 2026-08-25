import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface ResetPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Strength rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (strengthScore < 3) {
      setLocalError('Password does not meet the minimum strength requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const success = await resetPassword(password);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => onNavigate('login'), 2500);
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout onNavigateHome={() => onNavigate('architect')}>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-300 text-[11px] font-headline font-bold">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <span>SET NEW CREDENTIALS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            Create new password.
          </h2>
          <p className="text-xs font-body text-on-surface-variant">
            Enter your new secure password to restore access to your ProjectMatch ID.
          </p>
        </div>

        {/* Error Feedback */}
        {displayError && (
          <div className="p-3.5 rounded-2xl bg-error-container border border-error/40 text-on-error-container text-xs font-headline flex items-center gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-base text-error flex-shrink-0">error</span>
            <span>{displayError}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center animate-fadeIn py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-mint-accent mx-auto flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-headline font-extrabold text-on-surface">
                PASSWORD UPDATED! ✨
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Your credentials have been securely updated. Redirecting to sign in...
              </p>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="h-12 px-6 rounded-2xl bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow cursor-pointer"
            >
              SIGN IN NOW →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  key
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-4 rounded-2xl glass-input text-xs font-headline text-on-surface placeholder:text-on-surface-variant/50"
                  required
                />
              </div>

              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore >= 1 ? 'bg-error' : 'bg-outline-variant'}`} />
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore >= 2 ? 'bg-amber-400' : 'bg-outline-variant'}`} />
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore >= 3 ? 'bg-cyan-400' : 'bg-outline-variant'}`} />
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore >= 4 ? 'bg-emerald-500 dark:bg-mint-accent' : 'bg-outline-variant'}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-headline text-on-surface-variant">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}`}>
                      <span className="material-symbols-outlined text-[12px]">{hasMinLength ? 'check' : 'circle'}</span> 8+ Chars
                    </span>
                    <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}`}>
                      <span className="material-symbols-outlined text-[12px]">{hasUppercase ? 'check' : 'circle'}</span> Uppercase
                    </span>
                    <span className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}`}>
                      <span className="material-symbols-outlined text-[12px]">{hasLowercase ? 'check' : 'circle'}</span> Lowercase
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}`}>
                      <span className="material-symbols-outlined text-[12px]">{hasNumber ? 'check' : 'circle'}</span> Number
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  lock_reset
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-4 rounded-2xl glass-input text-xs font-headline text-on-surface placeholder:text-on-surface-variant/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-space-black border-t-transparent animate-spin" />
                  <span>UPDATING PASSWORD...</span>
                </>
              ) : (
                <>
                  <span>UPDATE PASSWORD →</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                ← Return to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
