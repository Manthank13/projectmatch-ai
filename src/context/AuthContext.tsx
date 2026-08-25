import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password?: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_USER: AuthUser = {
  id: 'usr_srm_001',
  email: 'alex.chen@srm.edu.in',
  fullName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  universityEmail: 'alex.chen@srm.edu.in',
  studentId: 'RA2111003010199',
  role: 'AI Systems Architect',
  department: 'CSE - AI & ML',
  campus: 'KTR Main Campus',
  emailVerified: true,
  createdAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('projectmatch_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('projectmatch_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('projectmatch_auth_user');
    }
  }, [user]);

  const clearError = () => setError(null);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!email || !email.includes('@')) {
      setError('Please enter a valid university email address.');
      setIsLoading(false);
      return false;
    }

    const authenticatedUser: AuthUser = {
      ...DEMO_AUTH_USER,
      email,
      universityEmail: email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
    };

    setUser(authenticatedUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (fullName: string, email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 900));

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

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email,
      fullName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      universityEmail: email,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const loginWithOAuth = async (provider: 'google' | 'github'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 700));

    const oauthUser: AuthUser = {
      ...DEMO_AUTH_USER,
      fullName: provider === 'google' ? 'Google Scholar' : 'GitHub Contributor',
      email: `${provider}.user@srm.edu.in`,
      universityEmail: `${provider}.user@srm.edu.in`
    };

    setUser(oauthUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('projectmatch_auth_user');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!email || !email.includes('@')) {
      setError('Please enter a valid university email.');
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 700));

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  };

  const verifyEmail = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (user) {
      setUser({ ...user, emailVerified: true });
    }
    setIsLoading(false);
    return true;
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        loginWithOAuth,
        logout,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
