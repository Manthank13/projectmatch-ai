import React, { useState, useEffect } from 'react';
import { Campus } from '../../types';
import { useData } from '../../context/DataContext';

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCampus?: Campus | null;
}

export const CampusModal: React.FC<CampusModalProps> = ({
  isOpen,
  onClose,
  initialCampus
}) => {
  const { addCampus, updateCampus } = useData();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [departmentsText, setDepartmentsText] = useState('CSE, AI/ML, DESIGN, ROBOTICS');
  const [labsText, setLabsText] = useState('NVIDIA Compute Cluster, Spatial Design Suite');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    if (initialCampus) {
      setName(initialCampus.name || '');
      setLocation(initialCampus.location || initialCampus.city || '');
      setDescription(initialCampus.description || '');
      setDepartmentsText((initialCampus.departments || []).join(', '));
      setLabsText((initialCampus.labs || []).join(', '));
    } else {
      setName('');
      setLocation('');
      setDescription('');
      setDepartmentsText('CSE, AI/ML, DESIGN, ROBOTICS');
      setLabsText('High Performance GPU Lab, Rapid Prototyping Core');
    }
  }, [initialCampus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!name.trim() || !location.trim()) {
      setErrorMessage('Please provide Campus Name and Location.');
      return;
    }

    const departments = departmentsText.split(',').map(s => s.trim()).filter(Boolean);
    const labs = labsText.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Omit<Campus, 'id'> = {
      name: name.trim(),
      code: name.trim().slice(0, 3).toUpperCase(),
      location: location.trim(),
      description: description.trim() || `${name} research and education facility located in ${location}.`,
      departments: departments.length > 0 ? departments : ['CSE', 'AI/ML'],
      labs: labs.length > 0 ? labs : ['Innovation Maker Core']
    };

    if (initialCampus) {
      updateCampus(initialCampus.id, payload);
    } else {
      addCampus(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-identity-card rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <div>
              <h3 className="text-lg font-headline font-extrabold text-on-surface">
                {initialCampus ? 'EDIT CAMPUS FACILITY' : 'ADD CAMPUS FACILITY'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Register facility hub in SRM Innovation Grid
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
              Campus Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. SRM Kattankulathur Main Campus"
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Location / City *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Chengalpattu, Tamil Nadu"
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Departments (Comma separated)
            </label>
            <input
              type="text"
              value={departmentsText}
              onChange={e => setDepartmentsText(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs font-headline text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1 uppercase tracking-wider">
              Labs / Research Cores (Comma separated)
            </label>
            <input
              type="text"
              value={labsText}
              onChange={e => setLabsText(e.target.value)}
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
              placeholder="Primary engineering & innovation center..."
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
              className="px-6 py-2.5 rounded-full bg-cyan-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 transition-all"
            >
              {initialCampus ? 'Save Changes' : 'Register Campus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
