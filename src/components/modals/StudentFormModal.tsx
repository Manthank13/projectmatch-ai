import React, { useState, useEffect } from 'react';
import { Student, SkillDomain } from '../../types';
import { useData } from '../../context/DataContext';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: Student | null;
}

const AVATAR_OPTIONS = [
  { label: 'Inventor / Tech Leader', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4RzXU2GB04GCYx9u-TAoQ9_9GsyWxjre7V_Ertq0_p93iiSYG-iozkIkbstlXtOj5ZYh5A4Yp1Zz9wWMwQWY-TN-Xz7cAmNQn9id5bRxq-DSApX3vpHAgq9FTzKifpPLdMyV0gfCPoR3CsTo4_bJJV7D_dihVsDTRPtaxRdmhu8614Cmf9jTuw9eVK8f6H9ziOdRZ4bJ3ZNDENmlebsWz7xI35GPkGdoRt-9-H_MwBu2EG01fTwpT' },
  { label: 'Brilliant Researcher', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyfXTIBvf2-HDDh7lWifR42qsLcGBD2Q5PEMnXBbdp2MU7VfKZ4Nygx5Y7WrmmfWZBZSV3vzTsJ8uKuN1u3_hAk9czScfULGlASGlxdG_LSVbOHjsbOYeCBHNkEGSj7x8Ii2Kk5Dtkt4nK5yoV9Z7yxYKRxAGT86nc1zyUxJRarMggSCwXQJhREOG3jIf29wSKbu2vFyabR0X0ElzYrVfU6rh4Fe09lce3oFHSZQLLYPDVoQMdPCWz' },
  { label: 'Energetic Developer', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIAEM0CmncmJFyu0d0iJUC33DhPTtnS5wovf_yHctEWhWzTKMTMSGIiDoCPIpcEMYVk7V0zm1z9ytOnFN8ZoILMfK-zIydqW8A8iqRoeUEyryUh-KA2Rhpb_AqBAVnyQ5iYuiFixWXTYk5F4efglYeDPoqoca_u19ylN9SjTu85YkMK-CCYKFpNZRr7bPgmtK2-pnimLtloPIIL3Ghdv51Q72cELzSoH7g3B8l6lu7idI602KENScV' },
  { label: 'Studious Scientist', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlUaDi8M5Ypywmk66BS1QQFHZeKlGfgJzUYF2XrOp2AvitIECXu4jfb43NiG5hq5138igY0iU-kTjM5wXJ-TOklcn7VVODT39dc3YmfBs8tcGJ8EgH4eprL-l-Ye0rL0v0xxa15RpS9SkPAmbkLKgwhDzxLCokZ84kxz8LT1wETSfBFmNqrIUCeAqa2BIYpCjbOQX1hvZIeBUi6XgNv1nCSqO6sf1eZ4TLDMHN2wsbx6liH3StwGZC' },
  { label: 'Forensic Detective', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA51i-Dxe6HXaGas_hRburQJ7Q90acBv0bp2cmUZYOX8lA75h4Z8g18g5bqynobuCvDogvvsZa_P5LeVS7K50EH3HCzSZlgtrNe94RQb6zboa-G_uAa0F7nUZruS3Ci9fEcop7odHAQsQi7nbd4YH30OY8EmXly3Cl27tZGF6qatKh7J_VC-L6DQouinBvDpTc0TepJ3rndjyu7hHy51ZB6fcPUCIOSuBi2cTkA11jV_25_yoXoVIMc' },
  { label: 'Product & UX Maven', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WIpwt9af-h2O_waK-V2JWa4mE0FdIstBdzyr5a2V_oJ9O3cHvMeC5pa9WZJK2XzWMELvohzB256nMabl2362_0-zIbpK_6wzzAFLUH34AYq3TeELZ3CfbdRSlWsnnP3GdEomH5Mf7rVW4Qrf0-yisweD-rRfYmSWGSSTwNgK8029CVcKL9Yy-w-v7z6MZi-Gt7TI_JUCuN3a-rRmVykQjlLm50yOBnUYs7HMMvXzB7ZomOM5YYI_' },
  { label: 'Ecosystem Guardian', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBC9H4GsmY7quvFdyvNJsCjU3NH9U1fR30xgUp7wPoEDnBHkcO4uXZLQAhYB_4aoqQAH4WrSXneNSq0PwLhP5x4Vs39HLgHiuq_ZtXA0hTmveOZtB1_LgCBHWICJPANWl05qTXtw2R9_3VcIu5G3-5yn_cNsTTReGUs0P_6eb_OWHDGqbmh1DhsT6f9RFrFZXp8vv4YdTXQ_LrUUEolISKrrjHBqoAoVmgGz2AX1CW5idTI9ODCg6A' },
  { label: 'Systems Mastermind', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgamFpNFORKxI7a7zfxUvEuGmjyCttK-Ql7mrJthpNrDydn6BgBcWfMnBbncVq0qR-w9ilRs9V9oJgfB5ZYXPcH0kbMtGuKw2-AYbyd3ivq3ZWhue0MaEMu7JVad9G97UJHmOKxyh8J-MYih0AbaYgKoZeHq9lRutgx9wl5mZGQ3fpYTLypGxXh2sUmWNabR0zts1MLZDe1t7p3MwL8AyQ33zUr-F9UxoKPXRGQ1o_oc96h7OrdKIh' }
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  initialStudent
}) => {
  const { addStudent, updateStudent, departments, campuses } = useData();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [campus, setCampus] = useState('Main Campus (Kattankulathur)');
  const [year, setYear] = useState('3rd Year');
  const [role, setRole] = useState('');
  const [availabilityHours, setAvailabilityHours] = useState(12);
  const [personalityLine, setPersonalityLine] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [primarySkill, setPrimarySkill] = useState('Machine Learning');
  const [primaryScore, setPrimaryScore] = useState(9);
  const [secondarySkill, setSecondarySkill] = useState('Python');
  const [secondaryScore, setSecondaryScore] = useState(8);
  const [domainTag, setDomainTag] = useState<SkillDomain>('AI / ML');

  // Animation states after submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState(0);

  useEffect(() => {
    if (initialStudent) {
      setName(initialStudent.name);
      setDepartment(initialStudent.department);
      setCampus(initialStudent.campus || 'Main Campus (Kattankulathur)');
      setYear(initialStudent.year || '3rd Year');
      setRole(initialStudent.role);
      setAvailabilityHours(initialStudent.availabilityHours);
      setPersonalityLine(initialStudent.personalityLine || '');
      setBio(initialStudent.bio || '');
      setAvatar(initialStudent.avatar);
      if (initialStudent.skills[0]) {
        setPrimarySkill(initialStudent.skills[0].name);
        setPrimaryScore(initialStudent.skills[0].score);
      }
      if (initialStudent.skills[1]) {
        setSecondarySkill(initialStudent.skills[1].name);
        setSecondaryScore(initialStudent.skills[1].score);
      }
    } else {
      setName('');
      setRole('');
      setAvailabilityHours(12);
      setPersonalityLine('');
      setBio('');
      setAvatar(AVATAR_OPTIONS[0].url);
    }
  }, [initialStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      alert('Please fill in your name and role!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStage(1);

    // Sequence stages:
    // 1. PROFILE CREATED ✓
    // 2. SKILLS INDEXED
    // 3. ROLE PROFILE CREATED
    // 4. TALENT NETWORK UPDATED
    setTimeout(() => setSubmitStage(2), 500);
    setTimeout(() => setSubmitStage(3), 1000);
    setTimeout(() => setSubmitStage(4), 1500);

    setTimeout(() => {
      const studentPayload: Omit<Student, 'id'> = {
        name: name.trim(),
        department,
        campus,
        year,
        role: role.trim(),
        availabilityHours: Number(availabilityHours),
        personalityLine: personalityLine.trim() || 'Ready to build something extraordinary.',
        bio: bio.trim() || `${name} is an active student researcher and developer at ${campus}.`,
        avatar,
        campusZone: 'AI LAB',
        badges: ['New Talent', 'Verified Student'],
        pastProjects: ['Campus Initiative', 'Open Source'],
        gpa: 9.0,
        contactEmail: `${name.toLowerCase().replace(/\s+/g, '.')}@srmgrid.synth`,
        domains: [domainTag],
        skills: [
          { name: primarySkill.trim() || 'Machine Learning', score: Number(primaryScore), category: domainTag },
          { name: secondarySkill.trim() || 'Python', score: Number(secondaryScore), category: domainTag }
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
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">{initialStudent ? 'edit' : 'person_add'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">
                {initialStudent ? 'EDIT CANDIDATE PROFILE' : 'JOIN THE TALENT NETWORK'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                {initialStudent ? 'Update your competencies and scheduling' : 'Add yourself to the SRM Innovation Grid synthetic talent pool'}
              </p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {isSubmitting ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary-fixed/50 flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-4xl text-on-secondary-fixed">auto_awesome</span>
            </div>

            <h4 className="text-2xl font-bold font-headline text-on-surface">
              INDEXING INTO TALENT NETWORK...
            </h4>

            {/* Checklist */}
            <div className="w-full max-w-sm space-y-3 font-headline text-sm text-left">
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                submitStage >= 1 ? 'bg-surface-container-high border-primary-container text-on-surface' : 'opacity-40'
              }`}>
                <span>1. PROFILE CREATED</span>
                {submitStage >= 1 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                submitStage >= 2 ? 'bg-surface-container-high border-primary-container text-on-surface' : 'opacity-40'
              }`}>
                <span>2. SKILLS & DOMAIN INDEXED</span>
                {submitStage >= 2 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                submitStage >= 3 ? 'bg-surface-container-high border-primary-container text-on-surface' : 'opacity-40'
              }`}>
                <span>3. ROLE PROFILE CREATED</span>
                {submitStage >= 3 && <span className="material-symbols-outlined text-green-600">check_circle</span>}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                submitStage >= 4 ? 'bg-primary-container text-on-primary-container font-bold border-transparent' : 'opacity-40'
              }`}>
                <span>4. TALENT NETWORK UPDATED ✓</span>
                {submitStage >= 4 && <span className="material-symbols-outlined">celebration</span>}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Choose Your Cartoon Avatar:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(opt.url)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${
                      avatar === opt.url ? 'border-primary shadow-lg ring-2 ring-primary-container' : 'border-outline-variant opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Miles Morales"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Preferred Role *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Mobile & AI Lead"
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
                />
              </div>
            </div>

            {/* Department & Campus */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Campus</label>
                <select
                  value={campus}
                  onChange={e => setCampus(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
                >
                  {campuses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Availability (hrs/week)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={availabilityHours}
                  onChange={e => setAvailabilityHours(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
                />
              </div>
            </div>

            {/* Skills & Scores */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-primary">
                Skills & Proficiency Ratings
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Primary Skill</label>
                  <input
                    type="text"
                    value={primarySkill}
                    onChange={e => setPrimarySkill(e.target.value)}
                    placeholder="e.g. Machine Learning"
                    className="w-full p-2.5 rounded-lg bg-surface border border-outline-variant text-sm mb-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span>Proficiency: {primaryScore}/10</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={primaryScore}
                      onChange={e => setPrimaryScore(Number(e.target.value))}
                      className="w-28"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Secondary Skill</label>
                  <input
                    type="text"
                    value={secondarySkill}
                    onChange={e => setSecondarySkill(e.target.value)}
                    placeholder="e.g. FastAPI / Backend"
                    className="w-full p-2.5 rounded-lg bg-surface border border-outline-variant text-sm mb-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span>Proficiency: {secondaryScore}/10</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={secondaryScore}
                      onChange={e => setSecondaryScore(Number(e.target.value))}
                      className="w-28"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personality Line */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Witty Personality One-Liner (Shown on your card)
              </label>
              <input
                type="text"
                value={personalityLine}
                onChange={e => setPersonalityLine(e.target.value)}
                placeholder='e.g. "Will probably redesign the entire project architecture overnight."'
                className="w-full p-3 rounded-xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container text-on-surface font-body text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full hover:bg-surface-variant text-on-surface font-headline text-sm font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-primary-container text-on-primary-container hover:scale-105 active:scale-95 font-headline text-sm font-bold shadow-soft transition-all"
              >
                {initialStudent ? 'Save Changes' : '✨ Add to Talent Grid'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
