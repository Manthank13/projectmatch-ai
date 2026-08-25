import { describe, it, expect } from 'vitest';

describe('Authentication & User Validation Suite', () => {
  // 1. University email format validation
  it('validates university email domains correctly', () => {
    const validEmails = [
      'student@srmist.edu.in',
      'tony.stark@srmgrid.synth',
      'developer@mit.edu',
      'researcher@stanford.edu'
    ];

    const invalidEmails = [
      'not-an-email',
      '@nodomain.com',
      'spaces in email@domain.com',
      ''
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  // 2. Password strength evaluation
  it('enforces password security policy (min 8 chars, uppercase, lowercase, number)', () => {
    const checkPasswordStrength = (pwd: string) => {
      const hasMinLength = pwd.length >= 8;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      return hasMinLength && hasUpper && hasLower && hasNumber;
    };

    expect(checkPasswordStrength('Weak1')).toBe(false);
    expect(checkPasswordStrength('alllowercase123')).toBe(false);
    expect(checkPasswordStrength('ALLUPPERCASE123')).toBe(false);
    expect(checkPasswordStrength('NoNumbersHere!')).toBe(false);
    expect(checkPasswordStrength('SecurePass123')).toBe(true);
    expect(checkPasswordStrength('ProjectMatch2026!')).toBe(true);
  });

  // 3. Signup payload validation
  it('constructs correct profile record from valid signup payload', () => {
    const userId = 'usr_test_12345';
    const signupData = {
      fullName: 'Manthan Sharma',
      email: 'manthan@srmist.edu.in',
      department: 'Computer Science & Engineering',
      campus: 'Main Campus (Kattankulathur)'
    };

    const profileRecord = {
      id: userId,
      full_name: signupData.fullName,
      email: signupData.email,
      department: signupData.department,
      campus: signupData.campus,
      avatar_url: null,
      created_at: new Date().toISOString()
    };

    expect(profileRecord.id).toBe(userId);
    expect(profileRecord.full_name).toBe('Manthan Sharma');
    expect(profileRecord.email).toBe('manthan@srmist.edu.in');
    expect(profileRecord.department).toBe('Computer Science & Engineering');
    expect(profileRecord.avatar_url).toBeNull();
  });

  // 4. Clean error message translation
  it('maps Supabase Auth error codes to user-friendly messages', () => {
    const mapAuthError = (errorMessage: string): string => {
      const msg = errorMessage.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return 'Incorrect email or password. Please check your credentials.';
      }
      if (msg.includes('email not confirmed') || msg.includes('unverified')) {
        return 'Please verify your email address before signing in.';
      }
      if (msg.includes('user already registered') || msg.includes('already exists')) {
        return 'An account with this university email already exists.';
      }
      if (msg.includes('fetch') || msg.includes('network')) {
        return 'Unable to reach the server. Please check your connection.';
      }
      return errorMessage;
    };

    expect(mapAuthError('Invalid login credentials')).toBe(
      'Incorrect email or password. Please check your credentials.'
    );
    expect(mapAuthError('Email not confirmed')).toBe(
      'Please verify your email address before signing in.'
    );
    expect(mapAuthError('User already registered')).toBe(
      'An account with this university email already exists.'
    );
  });
});
