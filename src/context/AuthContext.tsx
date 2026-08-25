import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthUser, AuthState, ProfileUpdatePayload } from '../types';
import { supabase, getProfile, upsertProfile } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    password?: string,
    department?: string,
    campus?: string
  ) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdatePayload) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Supabase User + Database Profile into AuthUser
function mapSupabaseUserToAuthUser(sbUser: User, profileData?: any): AuthUser {
  const metadata = sbUser.user_metadata || {};
  const email = sbUser.email || '';
  const fullName =
    profileData?.full_name ||
    metadata.full_name ||
    metadata.name ||
    email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const avatarUrl =
    profileData?.avatar_url ||
    metadata.avatar_url ||
    metadata.picture ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const department =
    profileData?.department ||
    metadata.department ||
    'Computer Science & Engineering';

  const campus =
    profileData?.campus ||
    metadata.campus ||
    'Main Campus (Kattankulathur)';

  const role =
    profileData?.role ||
    metadata.role ||
    'Student Technologist';

  return {
    id: sbUser.id,
    email: email,
    universityEmail: email,
    fullName: fullName,
    avatarUrl: avatarUrl,
    role: role,
    department: department,
    campus: campus,
    githubUrl: profileData?.github_url || metadata.github_url,
    linkedinUrl: profileData?.linkedin_url || metadata.linkedin_url,
    portfolioUrl: profileData?.portfolio_url || metadata.portfolio_url,
    resumeUrl: profileData?.resume_url || metadata.resume_url,
    bio: profileData?.bio || metadata.bio || '',
    skills: profileData?.skills || [],
    availabilityHours: profileData?.availability_hours || 14,
    emailVerified: Boolean(sbUser.email_confirmed_at),
    createdAt: sbUser.created_at || new Date().toISOString(),
    updatedAt: profileData?.updated_at || new Date().toISOString()
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sync and load user from Supabase session
  const loadUserFromSession = useCallback(async (sbUser: User) => {
    try {
      // Attempt to fetch profile record from Postgres
      const profile = await getProfile(sbUser.id);
      const authUser = mapSupabaseUserToAuthUser(sbUser, profile);
      setUser(authUser);
    } catch (err) {
      console.warn('Error loading profile from Postgres:', err);
      // Fallback to user metadata
      setUser(mapSupabaseUserToAuthUser(sbUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize Supabase Auth Session & Subscribe to Realtime Auth Changes
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Supabase getSession warning:', sessionError.message);
        }
        if (isMounted) {
          if (session?.user) {
            await loadUserFromSession(session.user);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('Supabase auth init exception:', err);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          await loadUserFromSession(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserFromSession]);

  /**
   * REAL LOGIN: Supabase email & password authentication
   */
  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!email || !email.trim()) {
      setError('Please enter your university email.');
      setIsLoading(false);
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (signInError) {
        const msg = signInError.message.toLowerCase();
        if (msg.includes('invalid login credentials') || msg.includes('invalid grant')) {
          setError('Incorrect email or password. Please check your credentials.');
        } else if (msg.includes('email not confirmed')) {
          setError('Please verify your email address before signing in.');
        } else if (msg.includes('user not found')) {
          setError('No account found with this university email.');
        } else {
          setError(signInError.message || 'Unable to sign in. Please try again.');
        }
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        try {
          const profile = await getProfile(data.user.id);
          if (!profile) {
            const meta = data.user.user_metadata || {};
            await upsertProfile({
              id: data.user.id,
              full_name: meta.full_name || meta.name || email.split('@')[0],
              email: email.trim(),
              department: meta.department || 'Computer Science & Engineering',
              campus: meta.campus || 'Main Campus (Kattankulathur)',
              avatar_url: meta.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            });
          }
        } catch (profileErr) {
          console.warn('Profile sync warning:', profileErr);
        }

        await loadUserFromSession(data.user);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (err: any) {
      const rawError = err?.message || String(err);
      if (rawError.includes('Failed to fetch') || rawError.includes('NetworkError')) {
        setError('Unable to connect to Supabase. Please check your internet connection or project configuration.');
      } else {
        setError(rawError);
      }
      setIsLoading(false);
      return false;
    }
  };

  /**
   * REAL SIGNUP: Supabase email & password registration + profile creation
   */
  const signup = async (
    fullName: string,
    email: string,
    password?: string,
    department?: string,
    campus?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required.');
      setIsLoading(false);
      return false;
    }
    if (!email || !email.includes('@')) {
      setError('A valid university email is required.');
      setIsLoading(false);
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return false;
    }

    const cleanDepartment = department || 'Computer Science & Engineering';
    const cleanCampus = campus || 'Main Campus (Kattankulathur)';

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            department: cleanDepartment,
            campus: cleanCampus,
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        }
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('user already exists')) {
          setError('An account with this university email already exists. Please sign in.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // If session is active (e.g. email confirmation turned off), upsert profile record
        if (data.session) {
          try {
            await upsertProfile({
              id: data.user.id,
              full_name: fullName.trim(),
              email: email.trim(),
              department: cleanDepartment,
              campus: cleanCampus,
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            });
          } catch (profileErr) {
            console.warn('Could not insert profile record:', profileErr);
          }

          await loadUserFromSession(data.user);
        }

        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      const rawError = err?.message || String(err);
      if (rawError.includes('Failed to fetch') || rawError.includes('NetworkError')) {
        setError('Unable to connect to Supabase. Please check your internet connection or project configuration.');
      } else {
        setError(rawError);
      }
      setIsLoading(false);
      return false;
    }
  };

  /**
   * REAL OAUTH: Google or GitHub OAuth
   */
  const loginWithOAuth = async (provider: 'google' | 'github'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err?.message || `Failed to initiate ${provider} authentication.`);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * REAL LOGOUT: Sign out and clear active session
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Logout warning:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  /**
   * REAL PROFILE UPDATE: Update Supabase metadata & Postgres profile record
   */
  const updateProfile = async (updates: ProfileUpdatePayload): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          department: updates.department,
          campus: updates.campus,
          role: updates.role,
          avatar_url: updates.avatarUrl
        }
      });

      // 2. Update Supabase Postgres profiles table
      const profileUpdates: any = {
        id: user.id,
        full_name: updates.fullName ?? user.fullName,
        department: updates.department ?? user.department,
        campus: updates.campus ?? user.campus,
        role: updates.role ?? user.role,
        avatar_url: updates.avatarUrl ?? user.avatarUrl,
        github_url: updates.githubUrl ?? user.githubUrl,
        linkedin_url: updates.linkedinUrl ?? user.linkedinUrl,
        portfolio_url: updates.portfolioUrl ?? user.portfolioUrl,
        resume_url: updates.resumeUrl ?? user.resumeUrl,
        bio: updates.bio ?? user.bio,
        skills: updates.skills ?? user.skills,
        availability_hours: updates.availabilityHours ?? user.availabilityHours
      };

      await upsertProfile(profileUpdates);

      // 3. Update local user state
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          fullName: updates.fullName ?? prev.fullName,
          department: updates.department ?? prev.department,
          campus: updates.campus ?? prev.campus,
          role: updates.role ?? prev.role,
          avatarUrl: updates.avatarUrl ?? prev.avatarUrl,
          githubUrl: updates.githubUrl ?? prev.githubUrl,
          linkedinUrl: updates.linkedinUrl ?? prev.linkedinUrl,
          portfolioUrl: updates.portfolioUrl ?? prev.portfolioUrl,
          resumeUrl: updates.resumeUrl ?? prev.resumeUrl,
          bio: updates.bio ?? prev.bio,
          skills: updates.skills ?? prev.skills,
          availabilityHours: updates.availabilityHours ?? prev.availabilityHours,
          updatedAt: new Date().toISOString()
        };
      });

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * REAL PASSWORD RECOVERY: Send password reset email
   */
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * REAL PASSWORD UPDATE: Update user password
   */
  const resetPassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to update password.');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Email verification helpers
   */
  const verifyEmail = async (): Promise<boolean> => {
    if (user) {
      setUser(prev => prev ? { ...prev, emailVerified: true } : null);
    }
    return true;
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!user?.email) return false;
    return forgotPassword(user.email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        error,
        login,
        signup,
        loginWithOAuth,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
