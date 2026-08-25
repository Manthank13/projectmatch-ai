import React, { useState, useEffect } from 'react';
import { ProjectArchetype } from '../../types';
import { useData } from '../../context/DataContext';
import { GlassDropdown } from '../common/GlassDropdown';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectArchetype | null;
}

const DOMAIN_TAGS = [
  'AI × ENVIRONMENT',
  'AI × ROBOTICS',
  'AI × AGRICULTURE',
  'DISASTER RESPONSE',
  'OPTIMIZATION × AUTONOMOUS SYSTEMS',
  'CYBERSECURITY & FORENSICS',
  'FINTECH & BLOCKCHAIN',
  'HEALTHCARE & BIOMEDICAL'
];

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

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setTag(initialProject.tag);
      setDescription(initialProject.description);
      setTeamSize(initialProject.teamSize);
      setMinAvailability(initialProject.minAvailability);
      setMandatorySkillsText(initialProject.mandatorySkills.join(', '));
      setPreferredSkillsText(initialProject.preferredSkills.join(', '));
      setIcon(initialProject.icon);
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
      setPreferredSkillsText('UI/UX Design, IoT/Sensors');
      setIcon('🚀');
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in project title and description!');
      return;
    }

    const mandatorySkills = mandatorySkillsText.split(',').map(s => s.trim()).filter(Boolean);
    const preferredSkills = preferredSkillsText.split(',').map(s => s.trim()).filter(Boolean);

    const projectPayload: Omit<ProjectArchetype, 'id'> = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      movieTag: `NEW — ${title.toUpperCase()}`,
      tag: tag.trim() || 'AI × INNOVATION',
      description: description.trim(),
      teamSize: Number(teamSize),
      minAvailability: Number(minAvailability),
      mandatorySkills: mandatorySkills.length > 0 ? mandatorySkills : ['Machine Learning', 'Backend/API Development'],
      preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['UI/UX Design'],
      preferredDepartments: [preferredDepartment],
      preferredCampuses: [preferredCampus],
      icon,
      accentColor: '#FF6B6B',
      idealTeamIds: []
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
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-soft">
              <span className="material-symbols-outlined">{initialProject ? 'edit_note' : 'post_add'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">
                {initialProject ? 'EDIT PROJECT BRIEF' : 'PUBLISH PROJECT BRIEF'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Index project requirements for AI squad architecting
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Satellite Fire Detector"
              className="w-full p-3 rounded-2xl glass-input text-sm text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <GlassDropdown
                label="Theme Category"
                value={tag}
                options={DOMAIN_TAGS}
                onChange={setTag}
                icon="category"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-headline text-on-surface mb-1.5 uppercase tracking-wider">
                Emoji Icon
              </label>
              <input
                type="text"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full p-3 rounded-2xl glass-input text-center text-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain the functional architecture and what kind of specialists you need..."
              className="w-full p-3 rounded-2xl glass-input text-sm text-on-surface resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
                Squad Size
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full p-3 rounded-2xl glass-input text-sm text-on-surface font-headline font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
                Min Availability (hrs/wk)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={minAvailability}
                onChange={e => setMinAvailability(Number(e.target.value))}
                className="w-full p-3 rounded-2xl glass-input text-sm text-on-surface font-headline font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassDropdown
              label="Primary Department"
              value={preferredDepartment}
              options={departments.map(d => ({ value: d.name, label: d.name, sublabel: d.code }))}
              onChange={setPreferredDepartment}
              searchable
              icon="domain"
            />

            <GlassDropdown
              label="Preferred Campus Hub"
              value={preferredCampus}
              options={campuses.map(c => ({ value: c.name, label: c.name }))}
              onChange={setPreferredCampus}
              icon="apartment"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Mandatory Capabilities (Comma-separated)
            </label>
            <input
              type="text"
              value={mandatorySkillsText}
              onChange={e => setMandatorySkillsText(e.target.value)}
              placeholder="Machine Learning, Backend/API Development, Data Analysis"
              className="w-full p-3 rounded-2xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Preferred Capabilities (Comma-separated)
            </label>
            <input
              type="text"
              value={preferredSkillsText}
              onChange={e => setPreferredSkillsText(e.target.value)}
              placeholder="UI/UX Design, IoT/Sensors, Cloud Deployment"
              className="w-full p-3 rounded-2xl glass-input text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full hover:bg-surface-variant text-on-surface font-headline text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline text-xs font-bold shadow-soft hover:scale-105"
            >
              {initialProject ? 'Save Changes' : '✨ Save Project Brief'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
