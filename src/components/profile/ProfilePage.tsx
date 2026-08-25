import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StudentSkill, SkillDomain } from '../../types';
import { uploadAvatarImage } from '../../lib/supabase';

interface ProfilePageProps {
  onNavigateToTalent?: () => void;
  onNavigateToLogin?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToTalent,
  onNavigateToLogin
}) => {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const { departments, campuses } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [role, setRole] = useState(user?.role || 'Student Technologist');
  const [department, setDepartment] = useState(user?.department || departments[0]?.name || 'Computer Science & Engineering');
  const [campus, setCampus] = useState(user?.campus || campuses[0]?.name || 'Main Campus (Kattankulathur)');
  const [bio, setBio] = useState(user?.bio || '');
  const [availabilityHours, setAvailabilityHours] = useState(user?.availabilityHours || 14);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');

  // Skills State
  const [skills, setSkills] = useState<StudentSkill[]>(
    user?.skills && user.skills.length > 0
      ? user.skills
      : [
          { name: 'Python', category: 'AI / ML', score: 92 },
          { name: 'React', category: 'CSE', score: 88 },
          { name: 'System Design', category: 'CSE', score: 85 }
        ]
  );
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillDomain>('CSE');
  const [newSkillScore, setNewSkillScore] = useState(85);

  // Feedback State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-2xl font-headline font-bold text-on-surface">
          Authentication Required
        </h2>
        <p className="text-xs font-body text-on-surface-variant max-w-sm">
          Please sign in to access and customize your ProjectMatch talent profile.
        </p>
        <button
          onClick={onNavigateToLogin}
          className="px-6 py-3 rounded-full bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-transform cursor-pointer"
        >
          SIGN IN →
        </button>
      </div>
    );
  }

  // Handle Avatar File Upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setSaveError(null);

    try {
      const publicUrl = await uploadAvatarImage(user.id, file);
      setAvatarUrl(publicUrl);
    } catch (err: any) {
      setSaveError('Failed to upload image. You can also paste an image URL directly.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        score: newSkillScore
      }
    ]);
    setNewSkillName('');
  };

  // Remove Skill
  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  // Handle Form Submit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    const success = await updateProfile({
      fullName,
      role,
      department,
      campus,
      bio,
      availabilityHours,
      avatarUrl,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      skills
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setSaveError('Failed to save profile changes. Please try again.');
    }
  };

  return (
    <div className="space-y-8 py-8 w-full max-w-4xl mx-auto animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-headline font-bold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>SUPABASE IDENTITY VERIFIED</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">
            My Talent Profile
          </h1>
          <p className="text-xs font-body text-on-surface-variant">
            Manage how the AI Team Architect and university collaborators discover your capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToTalent && (
            <button
              onClick={onNavigateToTalent}
              className="px-4 py-2 rounded-full glass-input hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">group</span>
              <span>View Talent Grid</span>
            </button>
          )}

          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-full bg-error-container/60 hover:bg-error-container border border-error/30 text-error text-xs font-headline font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Save Success / Error Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-mint-accent text-xs font-headline font-bold flex items-center gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Profile saved successfully to Supabase Postgres database! ✨</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-error-container border border-error/40 text-on-error-container text-xs font-headline flex items-center gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-lg text-error">error</span>
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Card 1: Avatar & Basic Information */}
        <div className="glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant space-y-6">
          <h2 className="text-base font-headline font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400">account_circle</span>
            <span>Identity & Visual Avatar</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-outline-variant/40">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-cyan-glow bg-surface flex-shrink-0">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-3xl flex flex-col items-center justify-center text-white text-xs font-headline font-bold transition-opacity cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">upload</span>
                <span>{isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            {/* Custom Avatar URL or Upload Action */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-headline font-bold text-on-surface mb-1">
                  Avatar Photo (Upload or Custom URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 h-11 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 h-11 rounded-2xl glass-input hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>Browse...</span>
                  </button>
                </div>
                <p className="text-[10px] font-body text-on-surface-variant mt-1">
                  Upload your own picture or paste any public image URL. Cartoon avatars are optional.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-headline text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
                  <strong>User ID:</strong> <span className="font-mono text-[11px]">{user.id.slice(0, 12)}...</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-cyan-500">mail</span>
                  <strong>Email:</strong> {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Tony Stark"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. AI Systems Architect"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
                required
              />
            </div>
          </div>

          {/* Department & Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Department
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full h-12 px-4 pr-8 rounded-2xl glass-input text-xs font-headline text-on-surface appearance-none bg-surface-container/60 cursor-pointer"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name} className="bg-surface text-on-surface">
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Campus Location
              </label>
              <div className="relative">
                <select
                  value={campus}
                  onChange={e => setCampus(e.target.value)}
                  className="w-full h-12 px-4 pr-8 rounded-2xl glass-input text-xs font-headline text-on-surface appearance-none bg-surface-container/60 cursor-pointer"
                >
                  {campuses.map(c => (
                    <option key={c.id} value={c.name} className="bg-surface text-on-surface">
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Availability */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Bio / Mission Statement
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="What do you build, and what complementary collaborators are you looking for?"
                className="w-full p-4 rounded-2xl glass-input text-xs font-body text-on-surface leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-headline font-bold text-on-surface">
                  Weekly Project Availability
                </label>
                <span className="text-xs font-headline font-extrabold text-cyan-600 dark:text-cyan-400">
                  {availabilityHours} Hours / Week
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={40}
                step={2}
                value={availabilityHours}
                onChange={e => setAvailabilityHours(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Skills & Capabilities */}
        <div className="glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant space-y-6">
          <h2 className="text-base font-headline font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">psychology</span>
            <span>Skills & Proficiency</span>
          </h2>

          {/* Existing Skills Pills */}
          <div className="flex flex-wrap gap-2">
            {skills.map(sk => (
              <span
                key={sk.name}
                className="skill-capsule px-3 py-1.5 rounded-full font-headline font-bold text-xs text-on-surface flex items-center gap-2"
              >
                <span>{sk.name}</span>
                <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold">{sk.score}%</strong>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk.name)}
                  className="hover:text-error text-on-surface-variant transition-colors ml-1 cursor-pointer"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add New Skill Row */}
          <div className="p-4 rounded-2xl bg-surface-container/40 border border-outline-variant/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-[11px] font-headline font-bold text-on-surface-variant">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="e.g. PyTorch, Figma, Rust"
                className="w-full h-10 px-3 rounded-xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-[11px] font-headline font-bold text-on-surface-variant">
                Domain
              </label>
              <select
                value={newSkillCategory}
                onChange={e => setNewSkillCategory(e.target.value as SkillDomain)}
                className="w-full h-10 px-3 rounded-xl glass-input text-xs font-headline text-on-surface bg-surface cursor-pointer"
              >
                <option value="AI / ML">AI / ML</option>
                <option value="CSE">CSE</option>
                <option value="DESIGN">DESIGN</option>
                <option value="BIOTECH">BIOTECH</option>
                <option value="ROBOTICS">ROBOTICS</option>
                <option value="ENVIRONMENT">ENVIRONMENT</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-headline font-bold text-on-surface-variant">
                Level ({newSkillScore}%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={newSkillScore}
                onChange={e => setNewSkillScore(parseInt(e.target.value, 10))}
                className="w-full h-10 px-3 rounded-xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddSkill}
                className="w-full h-10 rounded-xl bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-transform flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Professional Portfolios & Links */}
        <div className="glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant space-y-6">
          <h2 className="text-base font-headline font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 dark:text-mint-accent">link</span>
            <span>External Links & Proof of Work</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Portfolio / Personal Website URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-headline font-bold text-on-surface">
                Resume Link / PDF URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={e => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/... or resume.pdf"
                className="w-full h-12 px-4 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-sm font-extrabold shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-space-black border-t-transparent animate-spin" />
                <span>SAVING TO SUPABASE...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                <span>SAVE CHANGES →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
