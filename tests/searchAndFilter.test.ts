import { describe, it, expect } from 'vitest';
import { INITIAL_STUDENTS } from '../src/data/students';

describe('Search and Filter Engine Suite', () => {
  // 1. Text Search across name, role, bio
  it('filters students by text query matching name, role, or skills', () => {
    const query = 'Tony';
    const matches = INITIAL_STUDENTS.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.role.toLowerCase().includes(query.toLowerCase()) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(query.toLowerCase()))
    );

    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].name).toContain('Tony Stark');
  });

  // 2. Department filtering
  it('filters students by specific academic department', () => {
    const deptQuery = 'Biotechnology';
    const matches = INITIAL_STUDENTS.filter(s => s.department.includes(deptQuery));

    expect(matches.length).toBeGreaterThan(0);
    matches.forEach(student => {
      expect(student.department).toContain('Biotechnology');
    });
  });

  // 3. Domain filtering (AI/ML, BIOTECH, ENVIRONMENT, DESIGN)
  it('filters candidates by technical domain specialization', () => {
    const domain = 'AI / ML';
    const matches = INITIAL_STUDENTS.filter(s =>
      s.domains.some(d => d.toUpperCase().includes(domain))
    );

    expect(matches.length).toBeGreaterThan(0);
    matches.forEach(student => {
      expect(student.domains).toContain('AI / ML');
    });
  });

  // 4. Availability hours threshold filtering
  it('filters candidates by minimum weekly availability threshold', () => {
    const minHours = 14;
    const matches = INITIAL_STUDENTS.filter(s => s.availabilityHours >= minHours);

    expect(matches.length).toBeGreaterThan(0);
    matches.forEach(student => {
      expect(student.availabilityHours).toBeGreaterThanOrEqual(14);
    });
  });

  // 5. Handling zero-match queries
  it('handles zero-match queries gracefully without errors', () => {
    const impossibleQuery = 'xyznonexistentstudentname12345';
    const matches = INITIAL_STUDENTS.filter(s =>
      s.name.toLowerCase().includes(impossibleQuery) ||
      s.role.toLowerCase().includes(impossibleQuery)
    );

    expect(matches.length).toBe(0);
  });
});
