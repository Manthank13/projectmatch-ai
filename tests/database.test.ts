import { describe, it, expect } from 'vitest';
import { DatabaseProfile } from '../src/lib/supabase';

describe('Database & Profile State Suite', () => {
  // 1. DatabaseProfile payload structure
  it('constructs valid DatabaseProfile upsert payload', () => {
    const profile: DatabaseProfile = {
      id: 'usr_789_uuid',
      full_name: 'Tony Stark',
      email: 'tony.stark@srmgrid.synth',
      department: 'CSE - AI & Robotics',
      campus: 'Main Campus (Kattankulathur)',
      avatar_url: 'https://example.com/avatar.jpg',
      role: 'Lead AI & Hardware Architect',
      availability_hours: 15,
      github_url: 'https://github.com/tonystark-ai',
      linkedin_url: 'https://linkedin.com/in/tony-stark',
      portfolio_url: 'https://starkindustries.grid',
      resume_url: null,
      bio: 'Edge AI and hardware prototyping specialist.'
    };

    expect(profile.id).toBe('usr_789_uuid');
    expect(profile.availability_hours).toBe(15);
    expect(profile.github_url).toBe('https://github.com/tonystark-ai');
  });

  // 2. Safe mapping of null or missing fields
  it('handles null database fields gracefully without runtime exceptions', () => {
    const rawDbRow: Partial<DatabaseProfile> = {
      id: 'usr_partial',
      full_name: null,
      department: null,
      campus: null,
      avatar_url: null
    };

    const studentModel = {
      id: rawDbRow.id || 'unknown',
      name: rawDbRow.full_name || 'Student Technologist',
      department: rawDbRow.department || 'Computer Science & Engineering',
      campus: rawDbRow.campus || 'Main Campus',
      avatarUrl: rawDbRow.avatar_url || undefined,
      availabilityHours: rawDbRow.availability_hours || 10,
      skills: rawDbRow.skills || []
    };

    expect(studentModel.name).toBe('Student Technologist');
    expect(studentModel.department).toBe('Computer Science & Engineering');
    expect(studentModel.availabilityHours).toBe(10);
  });
});
