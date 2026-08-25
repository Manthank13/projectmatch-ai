import { Student } from '../types';
import { DatabaseProfile } from '../lib/supabase';
import { INITIAL_STUDENTS } from '../data/students';

/**
 * Map a Supabase Database Profile to a Student Model
 */
export function mapProfileToStudent(profile: DatabaseProfile): Student {
  const name = profile.full_name?.trim() || profile.email?.split('@')[0] || 'Campus Member';
  const role = profile.role || 'Student Technologist';
  const department = profile.department || 'Computer Science & Engineering';
  const campus = profile.campus || 'Main Campus (Kattankulathur)';

  const parsedSkills = Array.isArray(profile.skills) && profile.skills.length > 0
    ? profile.skills
    : [
        { name: 'Full-Stack Engineering', score: 9, category: 'CSE' },
        { name: 'System Architecture', score: 8, category: 'CSE' },
        { name: 'Python', score: 8, category: 'AI / ML' }
      ];

  return {
    id: profile.id,
    name,
    department,
    campus,
    year: '3rd Year (Junior)',
    role,
    availabilityHours: profile.availability_hours || 14,
    individualFitScore: 92,
    marginalTeamValue: 88,
    uniqueContribution: profile.bio || 'Full-Stack Execution & System Architecture',
    personalityLine: 'Verified campus technologist.',
    avatar: profile.avatar_url || '',
    avatarUrl: profile.avatar_url || undefined,
    profileImage: profile.avatar_url || undefined,
    campusZone: 'CAMPUS INNOVATION HUB',
    bio: profile.bio || 'Passionate student technologist in the campus talent network.',
    skills: parsedSkills,
    domains: ['CSE', 'AI / ML'],
    pastProjects: [],
    badges: ['Verified Technologist'],
    professionalLinks: {
      github: profile.github_url || undefined,
      linkedin: profile.linkedin_url || undefined,
      portfolio: profile.portfolio_url || undefined,
      other: profile.resume_url || undefined
    },
    resume: profile.resume_url ? {
      name: 'Resume Document',
      size: 'PDF',
      uploadDate: new Date().toLocaleDateString(),
      dataUrl: profile.resume_url
    } : undefined,
    isUserCreated: true,
    isSyntheticDemo: false,
    isDemo: false
  };
}

/**
 * Merge Real Registered Users (from Supabase Postgres) and Synthetic Demo Users
 * - Real users are added with isUserCreated = true, isDemo = false
 * - Demo users (Tony Stark, Shuri, Peter Parker, etc.) are preserved with isSyntheticDemo = true, isDemo = true
 * - Strictly deduplicated by canonical id (never duplicated)
 */
export function mergeStudentsWithProfiles(
  supabaseProfiles: DatabaseProfile[],
  demoStudents: Student[] = INITIAL_STUDENTS
): Student[] {
  const studentMap = new Map<string, Student>();

  // 1. Add all synthetic demo users
  demoStudents.forEach(demo => {
    studentMap.set(demo.id, {
      ...demo,
      isSyntheticDemo: true,
      isDemo: true,
      isUserCreated: false
    });
  });

  // 2. Add real users from Supabase Postgres (overrides if ID matches, otherwise prepends)
  supabaseProfiles.forEach(profile => {
    if (profile.id) {
      studentMap.set(profile.id, mapProfileToStudent(profile));
    }
  });

  // Return real users first, followed by demo users
  const realUsers: Student[] = [];
  const demoUsers: Student[] = [];

  studentMap.forEach(student => {
    if (student.isUserCreated) {
      realUsers.push(student);
    } else {
      demoUsers.push(student);
    }
  });

  return [...realUsers, ...demoUsers];
}
