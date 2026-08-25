import React, { useState, useEffect } from 'react';
import { Department } from '../../types';
import { useData } from '../../context/DataContext';
import { GlassDropdown } from '../common/GlassDropdown';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartment?: Department | null;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  initialDepartment
}) => {
  const { addDepartment, updateDepartment, campuses } = useData();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [campus, setCampus] = useState('Main Campus (Kattankulathur)');
  const [description, setDescription] = useState('');
  const [coreSkillsText, setCoreSkillsText] = useState('');
  const [researchAreasText, setResearchAreasText] = useState('');

  useEffect(() => {
    if (initialDepartment) {
      setName(initialDepartment.name);
      setCode(initialDepartment.code);
      setCampus(initialDepartment.campus);
      setDescription(initialDepartment.description);
      setCoreSkillsText(initialDepartment.coreSkills.join(', '));
      setResearchAreasText(initialDepartment.researchAreas.join(', '));
    } else {
      setName('');
      setCode('');
      setCampus('Main Campus (Kattankulathur)');
      setDescription('');
      setCoreSkillsText('Machine Learning, Python, Data Analytics');
      setResearchAreasText('Deep Learning, Edge Computing');
    }
  }, [initialDepartment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert('Please provide Department Name and Code!');
      return;
    }

    const coreSkills = coreSkillsText.split(',').map(s => s.trim()).filter(Boolean);
    const researchAreas = researchAreasText.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Omit<Department, 'id'> = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      campus,
      description: description.trim() || `${name} department at ${campus}.`,
      coreSkills: coreSkills.length > 0 ? coreSkills : ['Core Engineering'],
      researchAreas: researchAreas.length > 0 ? researchAreas : ['Applied Science']
    };

    if (initialDepartment) {
      updateDepartment(initialDepartment.id, payload);
    } else {
      addDepartment(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-soft">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">
                {initialDepartment ? 'EDIT DEPARTMENT' : 'ADD NEW DEPARTMENT'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Register academic cluster into SRM Innovation Grid
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
                Department Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Biomedical & Nanotech Lab"
                className="w-full p-3 rounded-2xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
                Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. BME"
                className="w-full p-3 rounded-2xl glass-input text-sm text-center uppercase font-headline font-bold"
              />
            </div>
          </div>

          <GlassDropdown
            label="Campus Facility"
            value={campus}
            options={campuses.map(c => ({ value: c.name, label: c.name }))}
            onChange={setCampus}
            icon="apartment"
          />

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Department Focus & Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Summary of research focus and lab specializations..."
              className="w-full p-3 rounded-2xl glass-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Core Competency Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={coreSkillsText}
              onChange={e => setCoreSkillsText(e.target.value)}
              placeholder="e.g. Bio-Sensors, Python, Microfluidics"
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
              {initialDepartment ? 'Save Changes' : '✨ Register Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
