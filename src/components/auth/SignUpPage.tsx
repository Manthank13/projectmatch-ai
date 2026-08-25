import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabase';
import { AuthLayout } from './AuthLayout';

interface SignUpPageProps {
  onNavigate: (route: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { signup, loginWithOAuth, isLoading, error, clearError } = useAuth();
  const { departments, campuses } = useData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [campus, setCampus] = useState(campuses[0]?.name || 'Main Campus (Kattankulathur)');
  const [localError, setLocalError] = useState<string | null>(null);

  // Password Strength Criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid university email address.');
      return;
    }
    if (strengthScore < 3) {
      setLocalError('Please meet the password strength requirements (at least 8 chars, 1 uppercase, 1 lowercase, 1 number).');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const success = await signup(fullName, email, password, department, campus);
    if (success) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        onNavigate('architect');
      } else {
        onNavigate('verify-email');
      }
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLocalError(null);
    clearError();
    await loginWithOAuth(provider);
  };

  const displayError = localError || error;

  return (
    <AuthLayout onNavigateHome={() => onNavigate('architect')}>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-600 dark:text-violet-300 text-[11px] font-headline font-bold">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>CAMPUS REGISTRATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            Build your ProjectMatch identity.
          </h2>
          <p className="text-xs font-body text-on-surface-variant">
            Tell us what you build, what you're good at, and where you want to collaborate.
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="p-3.5 rounded-2xl bg-error-container border border-error/40 text-on-error-container text-xs font-headline flex items-center gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-base text-error flex-shrink-0">error</span>
            <span>{displayError}</span>
          </div>
        )}

        {/* Social OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={isLoading}
            className="w-full h-12 px-4 rounded-2xl glass-input hover:bg-slate-900/5 dark:hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center justify-center gap-2.5 transition-all shadow-sm group cursor-pointer"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={isLoading}
            className="w-full h-12 px-4 rounded-2xl glass-input hover:bg-slate-900/5 dark:hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center justify-center gap-2.5 transition-all shadow-sm group cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-on-surface flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-outline-variant" />
          <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-wider">
            OR REGISTER WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-on-surface">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                person
              </span>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Miles Morales"
                className="w-full h-12 pl-10 pr-4 rounded-2xl glass-input text-xs font-headline text-on-surface placeholder:text-on-surface-variant/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
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
                className="w-full h-12 pl-10 pr-4 rounded-2xl glass-input text-xs font-headline text-on-surface placeholder:text-on-surface-variant/50"
                required
              />
            </div>
          </div>

          {/* Department and Campus Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Department
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  domain
                </span>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full h-12 pl-10 pr-8 rounded-2xl glass-input text-xs font-headline text-on-surface appearance-none bg-surface-container/60 cursor-pointer"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name} className="bg-surface text-on-surface">
                      {d.name.split('-')[0]}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Campus Location
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  apartment
                </span>
                <select
                  value={campus}
                  onChange={e => setCampus(e.target.value)}
                  className="w-full h-12 pl-10 pr-8 rounded-2xl glass-input text-xs font-headline text-on-surface appearance-none bg-surface-container/60 cursor-pointer"
                >
                  {campuses.map(c => (
                    <option key={c.id} value={c.name} className="bg-surface text-on-surface">
                      {c.name.split('(')[0]}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-on-surface">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                lock
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
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="p-3 rounded-2xl bg-surface-elevated/60 border border-outline-variant space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] font-headline font-bold">
                <span className="text-on-surface-variant">Strength Rating:</span>
                <span className={strengthScore >= 3 ? 'text-emerald-600 dark:text-mint-accent' : 'text-amber-500'}>
                  {strengthScore === 4 ? 'Optimal' : strengthScore >= 3 ? 'Strong' : 'Moderate'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map(idx => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx <= strengthScore
                        ? strengthScore === 4 ? 'bg-emerald-500 dark:bg-mint-accent' : 'bg-cyan-500'
                        : 'bg-outline-variant'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-headline text-on-surface-variant pt-1">
                <span className={hasMinLength ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}>
                  {hasMinLength ? '✓' : '○'} 8+ characters
                </span>
                <span className={hasUppercase ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}>
                  {hasUppercase ? '✓' : '○'} 1 uppercase
                </span>
                <span className={hasLowercase ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}>
                  {hasLowercase ? '✓' : '○'} 1 lowercase
                </span>
                <span className={hasNumber ? 'text-emerald-600 dark:text-mint-accent font-bold' : ''}>
                  {hasNumber ? '✓' : '○'} 1 number
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-on-surface">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                verified_user
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
            className="w-full h-12 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-space-black border-t-transparent animate-spin" />
                <span>REGISTERING IDENTITY...</span>
              </>
            ) : (
              <>
                <span>CREATE PROJECTMATCH ID →</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-outline-variant">
          <p className="text-xs font-body text-on-surface-variant">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-headline font-extrabold inline-flex items-center gap-0.5 ml-1 cursor-pointer"
            >
              Sign in →
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
