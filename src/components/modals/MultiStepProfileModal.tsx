import React, { useState, useEffect } from 'react';
import { Student, SkillDomain, PortfolioProject, ExperienceItem, ProfessionalLinks, ResumeDocument } from '../../types';
import { useData } from '../../context/DataContext';
import { GlassDropdown } from '../common/GlassDropdown';
import { ImageUpload } from '../common/ImageUpload';
import { ResumeUpload } from '../common/ResumeUpload';

interface MultiStepProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: Student | null;
}

const DOMAIN_OPTIONS: SkillDomain[] = [
  'AI / ML',
  'CSE',
  'BACKEND',
  'DATA',
  'DESIGN',
  'BIOTECH',
  'ENVIRONMENT',
  'ECE',
  'ROBOTICS',
  'ENGINEERING',
  'PRODUCT'
];

const YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Masters / Postgraduate',
  'PhD / Research Scholar'
];

export const MultiStepProfileModal: React.FC<MultiStepProfileModalProps> = ({
  isOpen,
  onClose,
  initialStudent
}) => {
  const { addStudent, updateStudent, departments, campuses } = useData();

  // Wizard Step (1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: About You
  const [name, setName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [year, setYear] = useState('3rd Year (Junior)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [campus, setCampus] = useState('Main Campus (Kattankulathur)');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuB4RzXU2GB04GCYx9u-TAoQ9_9GsyWxjre7V_Ertq0_p93iiSYG-iozkIkbstlXtOj5ZYh5A4Yp1Zz9wWMwQWY-TN-Xz7cAmNQn9id5bRxq-DSApX3vpHAgq9FTzKifpPLdMyV0gfCPoR3CsTo4_bJJV7D_dihVsDTRPtaxRdmhu8614Cmf9jTuw9eVK8f6H9ziOdRZ4bJ3ZNDENmlebsWz7xI35GPkGdoRt-9-H_MwBu2EG01fTwpT');

  // Step 2: Skills & Domain
  const [role, setRole] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState<SkillDomain>('AI / ML');
  const [skillsList, setSkillsList] = useState<Array<{ name: string; score: number; category: SkillDomain }>>([
    { name: 'Machine Learning', score: 9, category: 'AI / ML' },
    { name: 'Python', score: 9, category: 'AI / ML' },
    { name: 'Data Analysis', score: 8, category: 'DATA' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillScore, setNewSkillScore] = useState(8);

  // Step 3: Projects & Experience
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>([
    {
      name: 'Ocean Pollution Classifier',
      role: 'ML & Satellite Vision Lead',
      technologies: ['PyTorch', 'FastAPI', 'Sentinel-2'],
      description: 'Convolutional neural network for marine microplastic detection from multispectral feeds.',
      githubUrl: 'https://github.com/srm-student/ocean-net',
      outcome: 'Presented at SRM Innovation Expo 2024'
    }
  ]);
  const [newProjName, setNewProjName] = useState('');
  const [newProjRole, setNewProjRole] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');

  // Step 4: Digital Presence / Links
  const [links, setLinks] = useState<ProfessionalLinks>({
    github: 'https://github.com/srm-student',
    linkedin: 'https://linkedin.com/in/srm-student',
    portfolio: 'https://srm-portfolio.dev',
    kaggle: '',
    leetcode: ''
  });

  // Step 5: Proof of Work & Resume
  const [resume, setResume] = useState<ResumeDocument | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [personalityLine, setPersonalityLine] = useState('');
  const [achievements, setAchievements] = useState<string[]>(['1st Place SRM Smart India Hackathon', 'Dean\'s Merit Fellow']);
  const [newAchievement, setNewAchievement] = useState('');

  // Step 6: Availability & Preferences
  const [availabilityHours, setAvailabilityHours] = useState(14);
  const [preferredDays, setPreferredDays] = useState<string[]>(['Mon', 'Wed', 'Fri', 'Sat']);
  const [teamPreferences, setTeamPreferences] = useState('Open to interdisciplinary research and fast-paced hackathon prototyping.');

  // Submission animation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState(0);

  // Reset or initialize fields
  useEffect(() => {
    if (initialStudent) {
      setName(initialStudent.name);
      setStudentIdNumber(initialStudent.studentIdNumber || 'RA2111003010123');
      setContactEmail(initialStudent.contactEmail || `${initialStudent.name.toLowerCase().replace(/\s+/g, '.')}@srmgrid.synth`);
      setYear(initialStudent.year || '3rd Year (Junior)');
      setDepartment(initialStudent.department);
      setCampus(initialStudent.campus || 'Main Campus (Kattankulathur)');
      setRole(initialStudent.role);
      setAvailabilityHours(initialStudent.availabilityHours);
      setPersonalityLine(initialStudent.personalityLine || '');
      setBio(initialStudent.bio || '');
      setAvatar(initialStudent.avatar);
      setProfileImage(initialStudent.profileImage);
      setSkillsList(initialStudent.skills || []);
      setProjectsList(initialStudent.projectPortfolio || []);
      setLinks(initialStudent.professionalLinks || {});
      setResume(initialStudent.resume);
      setAchievements(initialStudent.achievements || []);
    } else {
      setName('');
      setRole('');
      setStudentIdNumber('RA2311003010456');
      setContactEmail('');
      setPersonalityLine('');
      setBio('');
      setProfileImage(undefined);
      setCurrentStep(1);
    }
  }, [initialStudent, isOpen]);

  if (!isOpen) return null;

  // Calculate Completeness % and Confidence %
  const calculateMetrics = () => {
    let score = 30; // baseline
    if (profileImage) score += 15;
    if (name.trim()) score += 10;
    if (skillsList.length >= 2) score += 15;
    if (projectsList.length >= 1) score += 15;
    if (links.github || links.linkedin || links.portfolio) score += 10;
    if (resume) score += 5;
    const completeness = Math.min(100, score);

    // Proof of work is based on verified projects and links
    const proofOfWork = Math.min(98, 60 + projectsList.length * 12 + (links.github ? 15 : 0) + (resume ? 8 : 0));
    const confidence = Math.min(96, Math.round((completeness * 0.5) + (proofOfWork * 0.5)));

    return { completeness, proofOfWork, confidence };
  };

  const { completeness, proofOfWork, confidence } = calculateMetrics();

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList(prev => [...prev, { name: newSkillName.trim(), score: Number(newSkillScore), category: primaryDomain }]);
    setNewSkillName('');
    setNewSkillScore(8);
  };

  const handleRemoveSkill = (idx: number) => {
    setSkillsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddProject = () => {
    if (!newProjName.trim()) return;
    setProjectsList(prev => [
      ...prev,
      {
        name: newProjName.trim(),
        role: newProjRole.trim() || 'Core Contributor',
        technologies: newProjTech.split(',').map(s => s.trim()).filter(Boolean),
        description: newProjDesc.trim() || 'University research & development initiative.',
        githubUrl: newProjGithub.trim() || undefined
      }
    ]);
    setNewProjName('');
    setNewProjRole('');
    setNewProjTech('');
    setNewProjDesc('');
    setNewProjGithub('');
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    setAchievements(prev => [...prev, newAchievement.trim()]);
    setNewAchievement('');
  };

  const handleSubmit = () => {
    if (!name.trim() || !role.trim()) {
      alert('Please fill in your Name and Role.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitStage(1);

    setTimeout(() => setSubmitStage(2), 450);
    setTimeout(() => setSubmitStage(3), 900);
    setTimeout(() => setSubmitStage(4), 1350);

    setTimeout(() => {
      const studentPayload: Omit<Student, 'id'> = {
        name: name.trim(),
        studentIdNumber: studentIdNumber.trim() || 'RA2311003010456',
        contactEmail: contactEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@srmgrid.synth`,
        year,
        department,
        campus,
        role: role.trim(),
        availabilityHours: Number(availabilityHours),
        personalityLine: personalityLine.trim() || 'Ready to build impactful projects with a great squad.',
        bio: bio.trim() || `${name} is an active student researcher and developer at ${department}, ${campus}.`,
        avatar,
        profileImage,
        campusZone: 'AI LAB',
        badges: achievements.length > 0 ? achievements.slice(0, 3) : ['Verified Student', 'Active Contributor'],
        pastProjects: projectsList.map(p => p.name),
        projectPortfolio: projectsList,
        professionalLinks: links,
        resume,
        achievements,
        gpa: 9.3,
        proofOfWorkScore: proofOfWork,
        profileConfidence: confidence,
        profileCompletion: completeness,
        preferredWorkingDays: preferredDays,
        teamPreferences,
        domains: [primaryDomain],
        skills: skillsList.length > 0 ? skillsList : [
          { name: 'Core Problem Solving', score: 9, category: primaryDomain },
          { name: 'Team Collaboration', score: 9, category: 'PRODUCT' }
        ]
      };

      if (initialStudent) {
        updateStudent(initialStudent.id, studentPayload);
      } else {
        addStudent(studentPayload);
      }

      setIsSubmitting(false);
      setSubmitStage(0);
      onClose();
    }, 2000);
  };

  const stepTitles = [
    'About You',
    'Capabilities & Skills',
    'Projects & Experience',
    'Digital Presence',
    'Proof of Work & Resume',
    'Availability & Schedule',
    'Review & Join Grid'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl my-8">
        {/* Modal Header & Step Indicator */}
        <div className="border-b border-outline-variant/40 pb-5 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-soft">
                <span className="material-symbols-outlined text-2xl font-bold">
                  {initialStudent ? 'edit_note' : 'person_add'}
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-headline font-extrabold text-on-surface">
                  {initialStudent ? 'EDIT TALENT PROFILE' : 'JOIN THE TALENT NETWORK'}
                </h3>
                <p className="text-xs font-body text-on-surface-variant">
                  Step {currentStep} of 7 — {stepTitles[currentStep - 1]}
                </p>
              </div>
            </div>

            {!isSubmitting && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-7 gap-1.5">
            {stepTitles.map((title, idx) => {
              const isPast = currentStep > idx + 1;
              const isCurrent = currentStep === idx + 1;
              return (
                <div
                  key={title}
                  onClick={() => !isSubmitting && setCurrentStep(idx + 1)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    isPast
                      ? 'bg-green-500'
                      : isCurrent
                      ? 'bg-primary-container shadow-soft'
                      : 'bg-surface-container'
                  }`}
                  title={`Step ${idx + 1}: ${title}`}
                />
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        {isSubmitting ? (
          /* Submission Animation */
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center animate-bounce shadow-glow">
              <span className="material-symbols-outlined text-4xl">auto_awesome</span>
            </div>

            <h4 className="text-2xl font-headline font-extrabold text-on-surface">
              INDEXING INTO TALENT NETWORK...
            </h4>

            <div className="w-full max-w-md space-y-3 font-headline text-sm text-left">
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                submitStage >= 1 ? 'glass-panel border-primary-container text-on-surface' : 'opacity-30'
              }`}>
                <span>1. PROFILE IDENTITY CREATED</span>
                {submitStage >= 1 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                submitStage >= 2 ? 'glass-panel border-primary-container text-on-surface' : 'opacity-30'
              }`}>
                <span>2. SKILLS & COMPETENCY MATRIX INDEXED</span>
                {submitStage >= 2 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                submitStage >= 3 ? 'glass-panel border-primary-container text-on-surface' : 'opacity-30'
              }`}>
                <span>3. PROOF OF WORK & RESUME VERIFIED</span>
                {submitStage >= 3 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                submitStage >= 4 ? 'bg-primary-container text-on-primary-container font-bold border-transparent shadow-soft' : 'opacity-30'
              }`}>
                <span>4. SYNCHRONIZED ACROSS UNIVERSITY GRID ✓</span>
                {submitStage >= 4 && <span className="material-symbols-outlined">celebration</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* STEP 1: ABOUT YOU */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <ImageUpload
                  profileImage={profileImage}
                  avatar={avatar}
                  onProfileImageChange={setProfileImage}
                  onAvatarChange={setAvatar}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Miles Morales"
                      className="w-full p-3 rounded-2xl glass-input text-sm font-body text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Student ID Number
                    </label>
                    <input
                      type="text"
                      value={studentIdNumber}
                      onChange={e => setStudentIdNumber(e.target.value)}
                      placeholder="e.g. RA2311003010456"
                      className="w-full p-3 rounded-2xl glass-input text-sm font-body text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <GlassDropdown
                    label="Academic Year"
                    value={year}
                    options={YEAR_OPTIONS}
                    onChange={setYear}
                    icon="school"
                  />

                  <GlassDropdown
                    label="Department"
                    value={department}
                    options={departments.map(d => ({ value: d.name, label: d.name, sublabel: d.code }))}
                    onChange={setDepartment}
                    searchable
                    icon="domain"
                  />

                  <GlassDropdown
                    label="Campus Hub"
                    value={campus}
                    options={campuses.map(c => ({ value: c.name, label: c.name }))}
                    onChange={setCampus}
                    icon="apartment"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: WHAT CAN YOU DO? */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Preferred Squad Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Lead AI & Computer Vision Architect"
                      className="w-full p-3 rounded-2xl glass-input text-sm font-body text-on-surface"
                    />
                  </div>

                  <GlassDropdown
                    label="Primary Domain"
                    value={primaryDomain}
                    options={DOMAIN_OPTIONS}
                    onChange={v => setPrimaryDomain(v as SkillDomain)}
                    icon="category"
                  />
                </div>

                {/* Skills Manager */}
                <div className="p-5 rounded-3xl glass-panel border border-outline-variant/40 space-y-4">
                  <span className="block text-xs font-headline font-bold text-primary uppercase tracking-wider">
                    Add & Rate Your Core Skills (1 to 10):
                  </span>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      placeholder="e.g. PyTorch, FastAPI, UI/UX, ROS2..."
                      className="flex-1 p-2.5 rounded-xl glass-input text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-headline font-bold text-on-surface">
                        Score: {newSkillScore}/10
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newSkillScore}
                        onChange={e => setNewSkillScore(Number(e.target.value))}
                        className="w-24"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl font-headline text-xs font-bold shadow-soft hover:scale-105"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {skillsList.map((sk, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl glass-input flex items-center justify-between text-xs font-headline"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{sk.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                            {sk.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-primary font-extrabold">{sk.score}/10</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(idx)}
                            className="text-error hover:opacity-80"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: WHAT HAVE YOU BUILT? */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-3xl glass-panel border border-outline-variant/40 space-y-4">
                  <span className="block text-xs font-headline font-bold text-secondary uppercase tracking-wider">
                    Add Project to Portfolio:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newProjName}
                      onChange={e => setNewProjName(e.target.value)}
                      placeholder="Project Name (e.g. Drone Obstacle SLAM)"
                      className="p-2.5 rounded-xl glass-input text-xs"
                    />
                    <input
                      type="text"
                      value={newProjRole}
                      onChange={e => setNewProjRole(e.target.value)}
                      placeholder="Your Role (e.g. Lead Systems Engineer)"
                      className="p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <input
                    type="text"
                    value={newProjTech}
                    onChange={e => setNewProjTech(e.target.value)}
                    placeholder="Technologies used (e.g. ROS2, C++, OpenCV, LiDAR)"
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  />

                  <textarea
                    rows={2}
                    value={newProjDesc}
                    onChange={e => setNewProjDesc(e.target.value)}
                    placeholder="Brief description of what the project accomplished..."
                    className="w-full p-2.5 rounded-xl glass-input text-xs resize-none"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                      type="url"
                      value={newProjGithub}
                      onChange={e => setNewProjGithub(e.target.value)}
                      placeholder="GitHub Repository URL (Optional)"
                      className="w-full sm:w-80 p-2.5 rounded-xl glass-input text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="w-full sm:w-auto px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-xl font-headline text-xs font-bold shadow-soft hover:scale-105"
                    >
                      + Save Project
                    </button>
                  </div>
                </div>

                {/* Existing Projects List */}
                <div className="space-y-3">
                  <span className="text-xs font-headline font-bold text-on-surface block uppercase">
                    Portfolio Showcase ({projectsList.length} Items):
                  </span>
                  {projectsList.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl glass-card border border-outline-variant/50 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-extrabold text-sm text-on-surface">
                            {p.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
                            {p.role}
                          </span>
                        </div>
                        <p className="text-xs font-body text-on-surface-variant">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.technologies.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-headline font-bold text-on-surface">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProjectsList(prev => prev.filter((_, i) => i !== idx))}
                        className="text-error hover:opacity-80 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: DIGITAL PRESENCE */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs font-body text-on-surface-variant">
                  Add links to your public repositories, code profiles, and portfolios. These will render as glass icon badges on your card.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-headline">
                  <div>
                    <label className="block text-on-surface font-bold mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={links.github || ''}
                      onChange={e => setLinks({ ...links, github: e.target.value })}
                      placeholder="https://github.com/yourhandle"
                      className="w-full p-3 rounded-2xl glass-input text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-bold mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={links.linkedin || ''}
                      onChange={e => setLinks({ ...links, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourhandle"
                      className="w-full p-3 rounded-2xl glass-input text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-bold mb-1">
                      Personal Portfolio / Website
                    </label>
                    <input
                      type="url"
                      value={links.portfolio || ''}
                      onChange={e => setLinks({ ...links, portfolio: e.target.value })}
                      placeholder="https://yourportfolio.site"
                      className="w-full p-3 rounded-2xl glass-input text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-on-surface font-bold mb-1">
                      Kaggle / LeetCode / Other
                    </label>
                    <input
                      type="url"
                      value={links.kaggle || ''}
                      onChange={e => setLinks({ ...links, kaggle: e.target.value })}
                      placeholder="https://kaggle.com/yourhandle"
                      className="w-full p-3 rounded-2xl glass-input text-on-surface"
                    />
                  </div>
                </div>

                {/* Achievements List */}
                <div className="p-5 rounded-3xl glass-panel border border-outline-variant/40 space-y-3">
                  <span className="block text-xs font-headline font-bold text-tertiary uppercase tracking-wider">
                    Key Credentials & Badges:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={e => setNewAchievement(e.target.value)}
                      placeholder="e.g. Hackathon Finalist, PyTorch Certified, IEEE Author"
                      className="flex-1 p-2.5 rounded-xl glass-input text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-4 py-2 bg-tertiary text-on-tertiary rounded-xl font-headline text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {achievements.map((ach, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold flex items-center gap-1.5"
                      >
                        ★ {ach}
                        <button
                          type="button"
                          onClick={() => setAchievements(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-error"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PROOF OF WORK & RESUME */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <ResumeUpload
                  resume={resume}
                  onResumeChange={setResume}
                />

                <div>
                  <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Candidate Dossier & Bio Summary
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Provide context on your technical focus, past research work, or what kind of hackathon team you want to lead..."
                    className="w-full p-3 rounded-2xl glass-input text-xs font-body text-on-surface resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Witty Personality One-Liner (Card Subtitle)
                  </label>
                  <input
                    type="text"
                    value={personalityLine}
                    onChange={e => setPersonalityLine(e.target.value)}
                    placeholder='e.g. "Will probably redesign the entire architecture at 2 AM."'
                    className="w-full p-3 rounded-2xl glass-input text-xs font-body text-on-surface"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: AVAILABILITY & COLLABORATION */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-3xl glass-panel border border-outline-variant/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-headline font-bold text-sm text-on-surface block">
                        Weekly Time Commitment:
                      </span>
                      <span className="text-xs font-body text-on-surface-variant">
                        Minimum 8 hrs/week required for optimal project match
                      </span>
                    </div>
                    <span className="text-2xl font-headline font-extrabold text-primary">
                      {availabilityHours} hrs/wk
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={availabilityHours}
                    onChange={e => setAvailabilityHours(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Preferred Working Days:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSelected = preferredDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) setPreferredDays(prev => prev.filter(d => d !== day));
                            else setPreferredDays(prev => [...prev, day]);
                          }}
                          className={`px-4 py-2 rounded-2xl font-headline text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-primary-container text-on-primary-container shadow-soft'
                              : 'glass-input text-on-surface-variant'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Team Culture & Working Preferences
                  </label>
                  <input
                    type="text"
                    value={teamPreferences}
                    onChange={e => setTeamPreferences(e.target.value)}
                    placeholder="e.g. Asynchronous, Discord active, weekend sprints..."
                    className="w-full p-3 rounded-2xl glass-input text-xs font-body text-on-surface"
                  />
                </div>
              </div>
            )}

            {/* STEP 7: REVIEW & PROFILE COMPLETENESS */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Live Scores Bar */}
                <div className="grid grid-cols-3 gap-3 font-headline text-center">
                  <div className="p-4 rounded-3xl glass-panel border border-primary-container/40">
                    <span className="text-[10px] text-on-surface-variant block uppercase font-bold">COMPLETENESS</span>
                    <span className="text-2xl font-extrabold text-primary">{completeness}%</span>
                  </div>

                  <div className="p-4 rounded-3xl glass-panel border border-secondary-container/40">
                    <span className="text-[10px] text-on-surface-variant block uppercase font-bold">PROOF OF WORK</span>
                    <span className="text-2xl font-extrabold text-secondary">{proofOfWork}%</span>
                  </div>

                  <div className="p-4 rounded-3xl glass-panel border border-tertiary-container/40">
                    <span className="text-[10px] text-on-surface-variant block uppercase font-bold">CONFIDENCE</span>
                    <span className="text-2xl font-extrabold text-tertiary">{confidence}%</span>
                  </div>
                </div>

                {/* Candidate Preview Dossier Card */}
                <div className="p-6 rounded-3xl glass-card border border-glass-border flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary-container shadow-soft flex-shrink-0 bg-surface">
                    <img
                      src={profileImage || avatar}
                      alt={name || 'Student'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-xl font-headline font-extrabold text-on-surface">
                        {name || 'Your Name'}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                        {year.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs font-headline font-bold text-primary">
                      {role || 'Preferred Role'}
                    </p>
                    <p className="text-xs font-body text-on-surface-variant">
                      {department} • {campus} • {availabilityHours} hrs/wk
                    </p>
                    {personalityLine && (
                      <p className="text-xs font-body text-on-surface-variant italic pt-1">
                        "{personalityLine}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-high text-xs font-headline text-center text-on-surface-variant">
                  ✦ Everything ready to publish into the SRM Innovation Grid talent index
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-outline-variant/40 font-headline text-xs font-bold">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 rounded-full hover:bg-surface-variant text-on-surface transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full hover:bg-surface-variant text-on-surface transition-colors"
                >
                  Cancel
                </button>
              )}

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-8 py-3 rounded-full bg-primary-container text-on-primary-container hover:scale-105 active:scale-95 shadow-soft transition-all"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3.5 rounded-full bg-primary-container text-on-primary-container hover:scale-105 active:scale-95 shadow-glow transition-all flex items-center gap-2 text-sm"
                >
                  <span>✨ JOIN THE TALENT GRID</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
