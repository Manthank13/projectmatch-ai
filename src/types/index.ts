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

export interface TeamDNAMetric {
  label: string;
  score: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'STUDENT_JOINED' | 'PROJECT_CREATED' | 'TEAM_ARCHITECTED' | 'CAMPUS_EXPANDED' | 'student' | 'project' | 'department' | 'system' | string;
  title?: string;
  text?: string;
  timestamp?: string;
  timeAgo?: string;
  description?: string;
  meta?: any;
}

export interface CampusZone {
  id: string;
  name: string;
  code?: string;
  campusId?: string;
  building?: string;
  activeNodes?: number;
  tagline?: string;
  [key: string]: any;
}

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
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Student {
  id: string;
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
  avatarUrl?: string; // Standard single source of truth for profile image
  avatar: string; // Fictional/cartoon avatar or fallback
  profileImage?: string; // Uploaded user photo
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
  isSyntheticDemo?: boolean;
  isDemo?: boolean;
}

export interface ProjectArchetype {
  id: string;
  title: string;
  slug: string;
  category?: string;
  description: string;
  department?: string;
  campus?: string;
  teamSize: number;
  minAvailability: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  mandatoryDomain?: SkillDomain;
  mandatoryDomains?: SkillDomain[];
  idealTeamIds?: string[];
  hiddenValueId?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  isUserCreated?: boolean;
  tags?: string[];
  tag?: string;
  movieTag?: string;
  icon?: string;
  accentColor?: string;
  minExperience?: string;
  preferredDepartments?: string[];
  preferredCampuses?: string[];
  [key: string]: any;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  building?: string;
  campus: string;
  totalStudents?: number;
  keySkillFocus?: string[];
  coreSkills?: string[];
  researchAreas?: string[];
  leadProfessor?: string;
  activeProjectsCount?: number;
  description?: string;
  [key: string]: any;
}

export interface Campus {
  id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  location?: string;
  established?: string;
  studentCount?: number;
  primaryFocus?: string;
  zones?: string[];
  departments?: string[];
  labs?: string[];
  image?: string;
  description?: string;
  [key: string]: any;
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
    source?: string;
  };
}

export interface CampusNetworkNode {
  id: string;
  label: string;
  type: 'STUDENT' | 'DEPARTMENT' | 'PROJECT' | 'CAMPUS';
  group: string;
  size: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface CampusNetworkLink {
  source: string;
  target: string;
  label?: string;
  value?: number;
}

/* ==========================================================
   AUTHENTICATION & PROFILE INTERFACES (Supabase Powered)
   ========================================================== */

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  universityEmail?: string;
  studentId?: string;
  role?: string;
  department?: string;
  campus?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  bio?: string;
  skills?: StudentSkill[];
  availabilityHours?: number;
  emailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProfileRecord {
  id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
  campus: string | null;
  role?: string | null;
  avatar_url: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  resume_url?: string | null;
  bio?: string | null;
  skills?: any;
  availability_hours?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdatePayload {
  fullName?: string;
  department?: string;
  campus?: string;
  role?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  bio?: string;
  skills?: StudentSkill[];
  availabilityHours?: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
