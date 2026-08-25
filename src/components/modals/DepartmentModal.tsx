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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    if (initialDepartment) {
      setName(initialDepartment.name || '');
      setCode(initialDepartment.code || '');
      setCampus(initialDepartment.campus || 'Main Campus (Kattankulathur)');
      setDescription(initialDepartment.description || '');
      setCoreSkillsText((initialDepartment.coreSkills || initialDepartment.keySkillFocus || []).join(', '));
      setResearchAreasText((initialDepartment.researchAreas || []).join(', '));
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
    setErrorMessage(null);
    if (!name.trim() || !code.trim()) {
      setErrorMessage('Please provide Department Name and Code.');
      return;
    }

    const coreSkills = coreSkillsText.split(',').map(s => s.trim()).filter(Boolean);
    const researchAreas = researchAreasText.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Omit<Department, 'id'> = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      campus,
      building: 'Main Academic Block',
      totalStudents: 450,
      description: description.trim() || `${name} department at ${campus}.`,
      coreSkills: coreSkills.length > 0 ? coreSkills : ['Core Computing'],
      keySkillFocus: coreSkills.length > 0 ? coreSkills : ['Core Computing'],
      researchAreas: researchAreas.length > 0 ? researchAreas : ['Applied Intelligence']
    };

    if (initialDepartment) {
      updateDepartment(initialDepartment.id, payload);
    } else {
      addDepartment(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <div>
              <h3 className="text-lg font-headline font-extrabold text-on-surface">
                {initialDepartment ? 'EDIT DEPARTMENT' : 'ADD ACADEMIC LAB / DEPT'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Register academic discipline in SRM Innovation Grid
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
          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Computer Science & Engineering (AI / ML)"
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
                Code / Short ID *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. CSE-AIML"
                className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface uppercase"
              />
            </div>

            <div>
              <GlassDropdown
                label="Campus Location"
                value={campus}
                options={campuses.map(c => c.name || '')}
                onChange={setCampus}
                icon="apartment"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Core Skills Focus (Comma separated)
            </label>
            <input
              type="text"
              value={coreSkillsText}
              onChange={e => setCoreSkillsText(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Research Areas (Comma separated)
            </label>
            <input
              type="text"
              value={researchAreasText}
              onChange={e => setResearchAreasText(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Department research focus and facilities..."
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
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
              className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-headline text-xs font-extrabold shadow-sm hover:scale-105 transition-all"
            >
              {initialDepartment ? 'Save Changes' : 'Register Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
