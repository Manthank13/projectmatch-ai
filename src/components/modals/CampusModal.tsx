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

  useEffect(() => {
    if (initialCampus) {
      setName(initialCampus.name);
      setLocation(initialCampus.location);
      setDescription(initialCampus.description);
      setDepartmentsText(initialCampus.departments.join(', '));
      setLabsText(initialCampus.labs.join(', '));
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
    if (!name.trim() || !location.trim()) {
      alert('Please provide Campus Name and Location!');
      return;
    }

    const departments = departmentsText.split(',').map(s => s.trim()).filter(Boolean);
    const labs = labsText.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Omit<Campus, 'id'> = {
      name: name.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-soft">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">
                {initialCampus ? 'EDIT CAMPUS FACILITY' : 'ADD NEW CAMPUS'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Expand the SRM Innovation Grid synthetic university network
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
              Campus Facility Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. SRM Innovation Grid — North Satellite Hub"
              className="w-full p-3 rounded-2xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Geographic Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Guindy Tech Park, Chennai"
              className="w-full p-3 rounded-2xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Primary academic purpose, student capacity, specializations..."
              className="w-full p-3 rounded-2xl glass-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Departments Hosted (Comma-separated)
            </label>
            <input
              type="text"
              value={departmentsText}
              onChange={e => setDepartmentsText(e.target.value)}
              placeholder="CSE, AI/ML, DESIGN, ROBOTICS"
              className="w-full p-3 rounded-2xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-headline text-on-surface mb-1 uppercase tracking-wider">
              Specialized Labs & Facilities (Comma-separated)
            </label>
            <input
              type="text"
              value={labsText}
              onChange={e => setLabsText(e.target.value)}
              placeholder="GPU Supercomputing, Anechoic Audio Chamber"
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
              {initialCampus ? 'Save Changes' : '✨ Register Campus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
