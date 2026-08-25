/**
 * Hybrid Deterministic Scoring Engine for ProjectMatch
 *
 * Implements exact weighted formula:
 * - mandatory_skill_coverage = 35%
 * - preferred_skill_coverage = 20%
 * - domain_coverage = 15%
 * - availability = 10%
 * - experience = 10%
 * - interdisciplinary_complementarity = 10%
 *
 * Clamps final score to [0, 100].
 */

export interface ScorerCandidate {
  id: string;
  name: string;
  department: string;
  availabilityHours: number;
  skills: { name: string; score: number; category?: string }[];
  domains?: string[];
  pastProjects?: string[];
  gpa?: number;
}

export interface ScorerProject {
  title: string;
  mandatorySkills?: string[];
  preferredSkills?: string[];
  mandatoryDomains?: string[];
  preferredDomains?: string[];
  minAvailability?: number;
  teamSize?: number;
}

export interface HybridScoreResult {
  teamScore: number;
  coverage: {
    mandatorySkills: number;
    preferredSkills: number;
    domains: number;
    roles: number;
  };
  metrics: {
    mandatorySkillCoverageScore: number;
    preferredSkillCoverageScore: number;
    domainCoverageScore: number;
    availabilityScore: number;
    experienceScore: number;
    interdisciplinaryScore: number;
  };
  details: {
    mandatoryCovered: string[];
    mandatoryMissing: string[];
    preferredCovered: string[];
    departmentsIncluded: string[];
  };
}

export function calculateDeterministicTeamScore(
  project: ScorerProject,
  selectedMembers: ScorerCandidate[]
): HybridScoreResult {
  const mandatorySkills = project.mandatorySkills || ['Machine Learning', 'Backend/API Development'];
  const preferredSkills = project.preferredSkills || ['UI/UX Design', 'Data Analysis'];
  const minAvailability = project.minAvailability || 8;
  const targetDomains = project.mandatoryDomains || ['AI / ML', 'ENVIRONMENT'];

  // 1. Mandatory Skill Coverage (35%)
  const mandatoryCovered: string[] = [];
  const mandatoryMissing: string[] = [];

  mandatorySkills.forEach(reqSkill => {
    const isCovered = selectedMembers.some(member =>
      member.skills.some(sk =>
        sk.name.toLowerCase().includes(reqSkill.toLowerCase().split(' ')[0]) && sk.score >= 6
      )
    );
    if (isCovered) {
      mandatoryCovered.push(reqSkill);
    } else {
      mandatoryMissing.push(reqSkill);
    }
  });

  const mandatoryRatio = mandatorySkills.length > 0
    ? mandatoryCovered.length / mandatorySkills.length
    : 1;
  const mandatorySkillCoverageScore = mandatoryRatio * 100;

  // 2. Preferred Skill Coverage (20%)
  const preferredCovered: string[] = [];
  preferredSkills.forEach(prefSkill => {
    const isCovered = selectedMembers.some(member =>
      member.skills.some(sk =>
        sk.name.toLowerCase().includes(prefSkill.toLowerCase().split(' ')[0]) && sk.score >= 5
      )
    );
    if (isCovered) preferredCovered.push(prefSkill);
  });

  const preferredRatio = preferredSkills.length > 0
    ? preferredCovered.length / preferredSkills.length
    : 1;
  const preferredSkillCoverageScore = preferredRatio * 100;

  // 3. Domain Coverage (15%)
  const coveredDomains = new Set<string>();
  selectedMembers.forEach(m => {
    m.domains?.forEach(d => coveredDomains.add(d.toUpperCase()));
    m.skills?.forEach(s => {
      if (s.category) coveredDomains.add(s.category.toUpperCase());
    });
  });

  let domainMatchCount = 0;
  targetDomains.forEach(td => {
    if (Array.from(coveredDomains).some(cd => cd.includes(td.toUpperCase().split(' ')[0]))) {
      domainMatchCount++;
    }
  });

  const domainRatio = targetDomains.length > 0
    ? domainMatchCount / targetDomains.length
    : 1;
  const domainCoverageScore = Math.min(100, domainRatio * 100);

  // 4. Availability Overlap (10%)
  const validAvailabilities = selectedMembers.filter(m => m.availabilityHours >= minAvailability);
  const avgAvailability = selectedMembers.reduce((acc, m) => acc + (m.availabilityHours || 0), 0) / Math.max(1, selectedMembers.length);
  const availabilityScore = Math.min(100, Math.round(
    (validAvailabilities.length / Math.max(1, selectedMembers.length)) * 70 +
    (avgAvailability / 15) * 30
  ));

  // 5. Experience & Proof of Work (10%)
  const totalProjects = selectedMembers.reduce((acc, m) => acc + (m.pastProjects?.length || 2), 0);
  const experienceScore = Math.min(100, Math.round((totalProjects / (selectedMembers.length * 3)) * 100));

  // 6. Interdisciplinary Complementarity / Department Diversity (10%)
  const distinctDepartments = Array.from(new Set(selectedMembers.map(m => m.department.split('-')[0].trim())));
  const diversityRatio = Math.min(1, distinctDepartments.length / Math.max(2, selectedMembers.length - 1));
  const interdisciplinaryScore = Math.round(diversityRatio * 100);

  // Weighted Combination Formula:
  // 35% mandatory + 20% preferred + 15% domain + 10% availability + 10% experience + 10% interdisciplinary
  const rawTeamScore =
    mandatorySkillCoverageScore * 0.35 +
    preferredSkillCoverageScore * 0.20 +
    domainCoverageScore * 0.15 +
    availabilityScore * 0.10 +
    experienceScore * 0.10 +
    interdisciplinaryScore * 0.10;

  const teamScore = Math.max(0, Math.min(100, Math.round(rawTeamScore)));

  return {
    teamScore,
    coverage: {
      mandatorySkills: Math.round(mandatorySkillCoverageScore),
      preferredSkills: Math.round(preferredSkillCoverageScore),
      domains: Math.round(domainCoverageScore),
      roles: Math.round(Math.min(100, (selectedMembers.length / (project.teamSize || 4)) * 100))
    },
    metrics: {
      mandatorySkillCoverageScore: Math.round(mandatorySkillCoverageScore),
      preferredSkillCoverageScore: Math.round(preferredSkillCoverageScore),
      domainCoverageScore: Math.round(domainCoverageScore),
      availabilityScore,
      experienceScore,
      interdisciplinaryScore
    },
    details: {
      mandatoryCovered,
      mandatoryMissing,
      preferredCovered,
      departmentsIncluded: distinctDepartments
    }
  };
}
