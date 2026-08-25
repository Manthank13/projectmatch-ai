import { describe, it, expect } from 'vitest';
import { architectTeamDynamic } from '../src/utils/teamArchitect';
import { INITIAL_STUDENTS } from '../src/data/students';
import { INITIAL_PROJECTS } from '../src/data/projects';

describe('Team Matching & Recommendation Engine Suite', () => {
  // 1. Requirement Extraction & Matching for Interstellar Ocean Brief
  it('architects a complete complementary team for ocean intelligence brief', () => {
    const prompt = "We're building an AI platform that detects ocean pollution using satellite imagery and environmental data.";
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result).toBeDefined();
    expect(result.team.length).toBe(4);
    expect(result.teamFit).toBeGreaterThanOrEqual(85);
    expect(result.mandatoryCoverage).toBe(100);

    // Verify all team members have valid IDs
    result.team.forEach(member => {
      expect(member.id).toBeDefined();
      expect(member.name).toBeDefined();
      expect(member.skills.length).toBeGreaterThan(0);
    });
  });

  // 2. Submodular Gap Minimization & Hidden Value Specialist
  it('identifies the hidden value domain specialist who eliminates capability bottlenecks', () => {
    const prompt = 'Autonomous agricultural harvesting drone using bio-sensors and soil telemetry';
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result.hiddenGem).toBeDefined();
    expect(result.hiddenGem.student).toBeDefined();
    expect(result.hiddenGem.marginalTeamValue).toBeGreaterThan(70);
    expect(result.hiddenGem.explanation.length).toBeGreaterThan(10);
  });

  // 3. Near-Miss Constraint Auditing
  it('detects near-miss candidate who was disqualified strictly due to availability boundary', () => {
    const prompt = 'Distributed high-frequency blockchain validator with 12 hrs/week minimum requirement';
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result.nearMiss).toBeDefined();
    expect(result.nearMiss.student).toBeDefined();
    expect(result.nearMiss.rejectionReason).toBeDefined();
    expect(result.nearMiss.availableHours).toBeDefined();
  });

  // 4. Team DNA Synthesis
  it('synthesizes multi-dimensional Team DNA capability metrics across 7 axes', () => {
    const prompt = 'AI Voice Assistant';
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result.teamDNA.length).toBe(7);
    result.teamDNA.forEach(metric => {
      expect(metric.label.length).toBeGreaterThan(0);
      expect(metric.score).toBeGreaterThanOrEqual(50);
      expect(metric.score).toBeLessThanOrEqual(100);
      expect(metric.color.startsWith('#')).toBe(true);
    });
  });

  // 5. Cross-Department Diversity
  it('captures interdisciplinary representation across multiple departments', () => {
    const prompt = 'Robotic marine ecosystem restoration';
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result.crossDepartmentMatches.length).toBeGreaterThanOrEqual(2);
  });

  // 6. Resilience against empty or unusual prompts
  it('generates a valid fallback team even with brief or novel project prompts', () => {
    const prompt = 'New Mobile App';
    const result = architectTeamDynamic(prompt, INITIAL_STUDENTS, INITIAL_PROJECTS);

    expect(result.team.length).toBe(4);
    expect(result.teamFit).toBeGreaterThan(80);
  });
});
