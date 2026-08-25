import { describe, it, expect } from 'vitest';
import { mapProfileToStudent, mergeStudentsWithProfiles } from '../src/utils/studentMapper';
import { INITIAL_STUDENTS } from '../src/data/students';
import { DatabaseProfile } from '../src/lib/supabase';

describe('Student Mapper & Profile Merger Suite', () => {
  const sampleProfile: DatabaseProfile = {
    id: '5e55bc20-86ff-4f34-a9f3-3cae0b6c71f5',
    full_name: 'Manthan',
    email: 'mk7415@srmist.edu.in',
    department: 'Computer Science & Engineering',
    campus: 'Main Campus (Kattankulathur)',
    role: 'Lead Full-Stack Architect',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    github_url: 'https://github.com/manthank',
    linkedin_url: 'https://linkedin.com/in/manthank',
    portfolio_url: 'https://manthan.dev',
    resume_url: 'https://manthan.dev/resume.pdf',
    bio: 'Building AI architectures & web systems.',
    skills: [
      { name: 'TypeScript', score: 9, category: 'CSE' },
      { name: 'React', score: 9, category: 'CSE' },
      { name: 'Python', score: 9, category: 'AI / ML' }
    ],
    availability_hours: 15
  };

  it('maps Supabase DatabaseProfile accurately to Student domain model', () => {
    const student = mapProfileToStudent(sampleProfile);

    expect(student.id).toBe('5e55bc20-86ff-4f34-a9f3-3cae0b6c71f5');
    expect(student.name).toBe('Manthan');
    expect(student.role).toBe('Lead Full-Stack Architect');
    expect(student.department).toBe('Computer Science & Engineering');
    expect(student.avatarUrl).toBe('https://images.unsplash.com/photo-1534528741775-53994a69daeb');
    expect(student.availabilityHours).toBe(15);
    expect(student.isUserCreated).toBe(true);
    expect(student.isSyntheticDemo).toBe(false);
    expect(student.isDemo).toBe(false);
    expect(student.skills.length).toBe(3);
    expect(student.professionalLinks?.github).toBe('https://github.com/manthank');
  });

  it('preserves all synthetic demo users alongside real registered users', () => {
    const combined = mergeStudentsWithProfiles([sampleProfile], INITIAL_STUDENTS);

    // Real user is included
    const manthan = combined.find(s => s.id === '5e55bc20-86ff-4f34-a9f3-3cae0b6c71f5');
    expect(manthan).toBeDefined();
    expect(manthan?.name).toBe('Manthan');
    expect(manthan?.isUserCreated).toBe(true);

    // Demo users are preserved
    const tony = combined.find(s => s.name === 'Tony Stark');
    const shuri = combined.find(s => s.name === 'Shuri');
    const peter = combined.find(s => s.name === 'Peter Parker');

    expect(tony).toBeDefined();
    expect(tony?.isSyntheticDemo).toBe(true);
    expect(shuri).toBeDefined();
    expect(peter).toBeDefined();

    // Total count is INITIAL_STUDENTS.length + 1
    expect(combined.length).toBe(INITIAL_STUDENTS.length + 1);
  });

  it('strictly prevents duplicate entries when the same profile is passed multiple times', () => {
    // Pass duplicate profile records with the same user ID
    const duplicateProfiles = [sampleProfile, sampleProfile, { ...sampleProfile, full_name: 'Manthan Updated' }];
    const combined = mergeStudentsWithProfiles(duplicateProfiles, INITIAL_STUDENTS);

    const matches = combined.filter(s => s.id === '5e55bc20-86ff-4f34-a9f3-3cae0b6c71f5');
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Manthan Updated');
  });
});
