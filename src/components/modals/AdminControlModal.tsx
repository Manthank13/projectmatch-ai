import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddStudent: () => void;
  onOpenAddProject: () => void;
  onOpenAddDepartment: () => void;
  onOpenAddCampus: () => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  onOpenAddStudent,
  onOpenAddProject,
  onOpenAddDepartment,
  onOpenAddCampus
}) => {
  const { students, projects, departments, campuses, activityLog, resetDemoData } = useData();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Calculate unique skills count
  const allSkillsSet = new Set<string>();
  students.forEach(s => s.skills.forEach(sk => allSkillsSet.add(sk.name)));

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-headline text-on-surface">
                  UNIVERSITY CONTROL & TELEMETRY
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold font-headline">
                  ADMIN
                </span>
              </div>
              <p className="text-xs font-body text-on-surface-variant">
                Live ecosystem telemetry and dataset management
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Live Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 font-headline text-center">
          <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/40">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">STUDENTS</span>
            <span className="text-2xl font-bold text-primary">{students.length}</span>
            <span className="text-[9px] text-on-surface-variant/70 block">INDEXED</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/40">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">PROJECTS</span>
            <span className="text-2xl font-bold text-secondary">{projects.length}</span>
            <span className="text-[9px] text-on-surface-variant/70 block">ACTIVE</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/40">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">DEPARTMENTS</span>
            <span className="text-2xl font-bold text-tertiary">{departments.length}</span>
            <span className="text-[9px] text-on-surface-variant/70 block">CLUSTERS</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/40">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">CAMPUSES</span>
            <span className="text-2xl font-bold text-on-surface">{campuses.length}</span>
            <span className="text-[9px] text-on-surface-variant/70 block">LOCATIONS</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-surface-container border border-outline-variant/40">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">SKILLS</span>
            <span className="text-2xl font-bold text-green-600">{allSkillsSet.size}</span>
            <span className="text-[9px] text-on-surface-variant/70 block">MAPPED</span>
          </div>
        </div>

        <div className="p-2 mb-6 rounded-xl bg-surface-variant/40 text-center text-xs font-headline text-on-surface-variant border border-outline-variant/30">
          ✦ ALL METRICS LABELLED: <strong>SYNTHETIC DEMO UNIVERSITY DATASET</strong>
        </div>

        {/* Quick Admin Actions */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-bold font-headline uppercase tracking-wider text-on-surface block">
            Ecosystem Registry Actions:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-headline text-xs">
            <button
              onClick={() => { onClose(); onOpenAddStudent(); }}
              className="p-3 rounded-xl bg-primary-fixed/40 hover:bg-primary-fixed border border-primary-fixed-dim text-on-primary-fixed font-bold flex flex-col items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xl">person_add</span>
              <span>+ ADD TALENT</span>
            </button>

            <button
              onClick={() => { onClose(); onOpenAddProject(); }}
              className="p-3 rounded-xl bg-secondary-fixed/40 hover:bg-secondary-fixed border border-secondary-fixed-dim text-on-secondary-fixed font-bold flex flex-col items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xl">post_add</span>
              <span>+ ADD PROJECT</span>
            </button>

            <button
              onClick={() => { onClose(); onOpenAddDepartment(); }}
              className="p-3 rounded-xl bg-tertiary-fixed/40 hover:bg-tertiary-fixed border border-tertiary-fixed-dim text-on-tertiary-fixed font-bold flex flex-col items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xl">domain</span>
              <span>+ ADD DEPT</span>
            </button>

            <button
              onClick={() => { onClose(); onOpenAddCampus(); }}
              className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface font-bold flex flex-col items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-xl">apartment</span>
              <span>+ ADD CAMPUS</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-bold font-headline uppercase tracking-wider text-on-surface block">
            Recent Talent Grid Activity:
          </span>
          <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/50 max-h-40 overflow-y-auto space-y-2 font-body text-xs">
            {activityLog.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  <span className="text-on-surface">{item.text}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/70 whitespace-nowrap">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Demo Data Section */}
        <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold font-headline text-on-surface block">
              Dataset Maintenance
            </span>
            <p className="text-xs font-body text-on-surface-variant">
              Restore the original synthetic pop-culture dataset anytime.
            </p>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-full text-xs font-headline font-bold text-on-surface hover:bg-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-full bg-error text-on-error text-xs font-headline font-bold hover:scale-105 shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-5 py-2 rounded-full border border-error text-error hover:bg-error-container hover:text-on-error-container font-headline text-xs font-bold transition-all"
            >
              RESET DEMO DATA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
