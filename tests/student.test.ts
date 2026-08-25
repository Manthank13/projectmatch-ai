import { describe, it, expect } from 'vitest';
import { INITIAL_STUDENTS } from '../src/data/students';
import { getStudentAvatar } from '../src/utils/avatar';
import { getDepartmentColor, getInitials } from '../src/components/common/StudentAvatar';
import { Student } from '../src/types';

describe('Student & Talent Entity Suite', () => {
  // 1. Initial student pool integrity
  it('loads valid initial students with mandatory attributes', () => {
    expect(INITIAL_STUDENTS.length).toBeGreaterThanOrEqual(16);

    INITIAL_STUDENTS.forEach(student => {
      expect(student.id).toBeDefined();
      expect(student.name.trim().length).toBeGreaterThan(0);
      expect(student.department.trim().length).toBeGreaterThan(0);
      expect(student.skills.length).toBeGreaterThan(0);
      expect(student.availabilityHours).toBeGreaterThan(0);
      expect(student.domains.length).toBeGreaterThan(0);
    });
  });

  // 2. Avatar 3-tier priority resolution
  it('resolves avatar URLs following canonical 3-tier priority', () => {
    // Priority 1: User-uploaded custom image
    const customUser: Partial<Student> = {
      avatarUrl: 'https://example.com/custom-photo.jpg',
      avatar: 'https://example.com/demo-cartoon.jpg'
    };
    expect(getStudentAvatar(customUser)).toBe('https://example.com/custom-photo.jpg');

    // Priority 2: Demo avatar for synthetic persona
    const demoStudent: Partial<Student> = {
      avatar: 'https://example.com/demo-cartoon.jpg'
    };
    expect(getStudentAvatar(demoStudent)).toBe('https://example.com/demo-cartoon.jpg');

    // Priority 3: Fallback when no avatar exists
    const emptyStudent: Partial<Student> = {};
    expect(getStudentAvatar(emptyStudent)).toBeDefined();
  });

  // 3. Initials generator for deterministic monogram
  it('extracts correct student initials for deterministic monogram fallback', () => {
    expect(getInitials('Tony Stark')).toBe('TS');
    expect(getInitials('Peter Parker')).toBe('PP');
    expect(getInitials('Shuri')).toBe('SH');
    expect(getInitials('Kavya R Nair')).toBe('KN');
    expect(getInitials('')).toBe('PM');
  });

  // 4. Department identity colors
  it('assigns correct aesthetic color themes to university departments', () => {
    const aiColor = getDepartmentColor('CSE - AI & Robotics');
    expect(aiColor.hex).toBe('#00E5FF'); // Cyan

    const bioColor = getDepartmentColor('Biotechnology & Marine Ecology');
    expect(bioColor.hex).toBe('#10B981'); // Emerald

    const designColor = getDepartmentColor('Design & Interaction Studio');
    expect(designColor.hex).toBe('#EC4899'); // Pink / Violet

    const cseColor = getDepartmentColor('CSE - Distributed Systems');
    expect(cseColor.hex).toBe('#8B5CF6'); // Violet / Blue
  });

  // 5. Skill scoring and validation
  it('validates skill scores within valid 1-10 range', () => {
    INITIAL_STUDENTS.forEach(student => {
      student.skills.forEach(skill => {
        expect(skill.score).toBeGreaterThanOrEqual(1);
        expect(skill.score).toBeLessThanOrEqual(10);
      });
    });
  });
});
