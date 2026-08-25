import React, { useState, useEffect } from 'react';
import { ProjectArchetype } from '../../types';
import { useData } from '../../context/DataContext';
import { GlassDropdown } from '../common/GlassDropdown';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectArchetype | null;
}

const ICONS = ['🚀', '🌊', '🛰️', '⚡', '🧠', '🌿', '🧬', '🔬', '🌐', '🛡️', '🤖', '📊'];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  initialProject
}) => {
  const { addProject, updateProject, departments, campuses } = useData();

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('AI × ENVIRONMENT');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [minAvailability, setMinAvailability] = useState(8);
  const [mandatorySkillsText, setMandatorySkillsText] = useState('Machine Learning, Backend/API Development, Data Analysis');
  const [preferredSkillsText, setPreferredSkillsText] = useState('UI/UX Design, IoT/Sensors, Cloud Infrastructure');
  const [preferredDepartment, setPreferredDepartment] = useState('Computer Science & Engineering');
  const [preferredCampus, setPreferredCampus] = useState('Main Campus (Kattankulathur)');
  const [icon, setIcon] = useState('🚀');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    if (initialProject) {
      setTitle(initialProject.title || '');
      setTag(initialProject.tag || (initialProject.tags ? initialProject.tags[0] : 'AI × ENVIRONMENT'));
      setDescription(initialProject.description || '');
      setTeamSize(initialProject.teamSize || 4);
      setMinAvailability(initialProject.minAvailability || 8);
      setMandatorySkillsText((initialProject.mandatorySkills || []).join(', '));
      setPreferredSkillsText((initialProject.preferredSkills || []).join(', '));
      setIcon(initialProject.icon || '🚀');
      if (initialProject.preferredDepartments?.[0]) {
        setPreferredDepartment(initialProject.preferredDepartments[0]);
      }
      if (initialProject.preferredCampuses?.[0]) {
        setPreferredCampus(initialProject.preferredCampuses[0]);
      }
    } else {
      setTitle('');
      setTag('AI × ENVIRONMENT');
      setDescription('');
      setTeamSize(4);
      setMinAvailability(8);
      setMandatorySkillsText('Machine Learning, Backend/API Development, Data Analysis');
      setPreferredSkillsText('UI/UX Design, Cloud Infrastructure, Docker');
      setIcon('🚀');
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in project title and description.');
      return;
    }

    const mandatorySkills = mandatorySkillsText.split(',').map(s => s.trim()).filter(Boolean);
    const preferredSkills = preferredSkillsText.split(',').map(s => s.trim()).filter(Boolean);

    const projectPayload: Omit<ProjectArchetype, 'id'> = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      category: 'AI_INNOVATION',
      department: preferredDepartment,
      campus: preferredCampus,
      movieTag: `PROJECT — ${title.toUpperCase()}`,
      tag: tag.trim() || 'AI × INNOVATION',
      tags: [tag.trim() || 'AI × INNOVATION'],
      description: description.trim(),
      teamSize: Number(teamSize),
      minAvailability: Number(minAvailability),
      mandatorySkills: mandatorySkills.length > 0 ? mandatorySkills : ['Machine Learning', 'Backend/API Development'],
      preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['UI/UX Design'],
      preferredDepartments: [preferredDepartment],
      preferredCampuses: [preferredCampus],
      icon,
      accentColor: '#00E5FF',
      idealTeamIds: [],
      hiddenValueId: 'S004',
      isUserCreated: true
    };

    if (initialProject) {
      updateProject(initialProject.id, projectPayload);
    } else {
      addProject(projectPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-lg font-headline font-extrabold text-on-surface">
                {initialProject ? 'EDIT PROJECT BRIEF' : 'INDEX NEW PROJECT BRIEF'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Define requirements for AI Squad Architecting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/[0.08] text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-2xl bg-error-container border border-error/40 text-on-error-container text-xs font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-error">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Autonomous Satellite Fire Detector"
                className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                Badge / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="e.g. AI × SPACE"
                className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain the project scope, hardware/software objectives, and domain goals..."
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-2 uppercase tracking-wider">
              Project Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    icon === ic
                      ? 'bg-cyan-500/20 border border-cyan-400 scale-110 shadow-cyan-glow'
                      : 'glass-input hover:bg-white/[0.08]'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                Required Squad Size
              </label>
              <input
                type="number"
                min={2}
                max={6}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                Min. Availability (hrs/wk)
              </label>
              <input
                type="number"
                min={4}
                max={30}
                value={minAvailability}
                onChange={e => setMinAvailability(Number(e.target.value))}
                className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Mandatory Skills (Comma separated)
            </label>
            <input
              type="text"
              value={mandatorySkillsText}
              onChange={e => setMandatorySkillsText(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Preferred Skills (Comma separated)
            </label>
            <input
              type="text"
              value={preferredSkillsText}
              onChange={e => setPreferredSkillsText(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassDropdown
              label="Primary Department"
              value={preferredDepartment}
              options={departments.map(d => d.name || '')}
              onChange={setPreferredDepartment}
              searchable
              icon="domain"
            />

            <GlassDropdown
              label="Primary Campus"
              value={preferredCampus}
              options={campuses.map(c => c.name || '')}
              onChange={setPreferredCampus}
              icon="apartment"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full hover:bg-white/[0.08] text-xs font-headline font-bold text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-all"
            >
              {initialProject ? 'Save Changes' : 'Index Project Brief'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
