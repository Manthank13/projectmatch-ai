export type SkillDomain = 
  | 'AI / ML'
  | 'CSE'
  | 'BACKEND'
  | 'DATA'
  | 'DESIGN'
  | 'BIOTECH'
  | 'ENVIRONMENT'
  | 'ECE'
  | 'ROBOTICS'
  | 'ENGINEERING'
  | 'PRODUCT';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StudentSkill {
  name: string;
  score: number; // 1 to 10
  category: SkillDomain;
  demonstratedProjectsCount?: number;
}

export interface ProfessionalLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  kaggle?: string;
  behance?: string;
  dribbble?: string;
  scholar?: string;
  youtube?: string;
  other?: string;
}

export interface ResumeDocument {
  name: string;
  size: string;
  uploadDate: string;
  dataUrl?: string;
}

export interface PortfolioProject {
  id?: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  outcome?: string;
}

export interface ExperienceItem {
  id?: string;
  title: string;
  organization: string;
  role: string;
  description: string;
  duration: string;
  link?: string;
  type?: 'Internship' | 'Research' | 'Hackathon' | 'Leadership' | 'Club';
}

export interface Student {
  id: string; // e.g. 'S001' or 'U-1234'
  name: string;
  department: string;
  campus: string;
  year: string; // e.g. '3rd Year' or '2025'
  role: string;
  skills: StudentSkill[];
  domains: string[];
  availabilityHours: number; // hours/week
  individualFitScore?: number; // percentage (e.g. 62)
  marginalTeamValue?: number; // percentage (e.g. 90)
  uniqueContribution?: string;
  personalityLine: string;
  avatar: string; // Fictional/cartoon avatar or fallback
  profileImage?: string; // Real uploaded user photo (Data URL or image URL)
  bio: string;
  campusZone: string;
  satelliteExperience?: boolean;
  badges: string[];
  pastProjects: string[];
  projectPortfolio?: PortfolioProject[];
  experienceItems?: ExperienceItem[];
  achievements?: string[];
  professionalLinks?: ProfessionalLinks;
  resume?: ResumeDocument;
  gpa?: number;
  contactEmail?: string;
  studentIdNumber?: string;
  proofOfWorkScore?: number; // e.g. 92%
  profileConfidence?: number; // e.g. 94%
  profileCompletion?: number; // e.g. 85%
  preferredWorkingDays?: string[];
  teamPreferences?: string;
  privacy?: {
    profile: 'PUBLIC' | 'UNIVERSITY_ONLY' | 'PRIVATE';
    resume: 'TEAM_MATCHES_ONLY' | 'PROFILE_VIEWERS' | 'PRIVATE';
  };
  isUserCreated?: boolean;
}

export interface ProjectArchetype {
  id: string;
  title: string;
  slug: string;
  movieTag: string; // e.g. '01 — INTERSTELLAR'
  tag: string; // e.g. 'AI × ENVIRONMENT'
  description: string;
  teamSize: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  mandatoryDomain?: string;
  preferredDomain?: string;
  minAvailability: number;
  minExperience?: string;
  preferredDepartments?: string[];
  preferredCampuses?: string[];
  constraints?: string[];
  icon: string;
  accentColor: string;
  idealTeamIds: string[];
  nearMissId?: string;
  hiddenValueId?: string;
  isUserCreated?: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  campus: string;
  description: string;
  coreSkills: string[];
  researchAreas: string[];
}

export interface Campus {
  id: string;
  name: string;
  location: string;
  description: string;
  departments: string[];
  labs: string[];
}

export interface ActivityItem {
  id: string;
  text: string;
  timeAgo: string;
  type: 'student' | 'project' | 'department' | 'system';
}

export interface TeamDNAMetric {
  label: string;
  score: number; // 0 to 100
  color: string;
}

export interface TeamArchitectResult {
  projectId: string;
  projectName: string;
  projectDescription: string;
  teamFit: number;
  mandatoryCoverage: number;
  teamSynergy: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  extractedRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    teamSize: number;
    minAvailability: number;
    mandatoryDomain: string;
  };
  team: Student[];
  crossDepartmentMatches: string[];
  hiddenGem: {
    student: Student;
    individualFit: number;
    marginalTeamValue: number;
    capabilityEliminated: string;
    beforeCoverage: { skill: string; covered: boolean }[];
    afterCoverage: { skill: string; covered: boolean }[];
    explanation: string;
  };
  nearMiss: {
    student: Student;
    rejectionReason: string;
    constraintFailed: string;
    availableHours: number;
    requiredHours: number;
    technicalHighlights: string[];
  };
  capabilityCoverage: {
    mandatory: { name: string; percentage: number; contributors: string[] }[];
    preferred: { name: string; percentage: number; contributors: string[] }[];
  };
  teamDNA: TeamDNAMetric[];
  aiReasoning?: {
    synergyReasoning: string;
    whyThisTeam: string;
    teamStrengths: string[];
    teamGaps: string[];
    source: string;
  };
}

export interface CampusZone {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  activeStudents: number;
  coreDomains: string[];
  coordinates: { x: number; y: number };
  color: string;
  telemetry: {
    gpuLoad: string;
    activeExperiments: number;
    talentUtilization: string;
  };
}
