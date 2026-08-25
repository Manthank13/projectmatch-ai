import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CampusZone, Department, Campus, Student } from '../../types';
import { CAMPUS_ZONES } from '../../data/campusNodes';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface CampusCommandCenterProps {
  onOpenAddDepartment: () => void;
  onOpenAddCampus: () => void;
  onEditDepartment: (department: Department) => void;
  onEditCampus: (campus: Campus) => void;
  onSelectStudent: (student: Student) => void;
}

export const CampusCommandCenter: React.FC<CampusCommandCenterProps> = ({
  onOpenAddDepartment,
  onOpenAddCampus,
  onEditDepartment,
  onEditCampus,
  onSelectStudent
}) => {
  const { departments, campuses, students, deleteDepartment, deleteCampus } = useData();

  const [activeZone, setActiveZone] = useState<CampusZone>(CAMPUS_ZONES[0]);
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'departments' | 'campuses'>('map');

  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [campusToDelete, setCampusToDelete] = useState<Campus | null>(null);

  // Find students stationed in the selected zone
  const stationedStudents = students.filter(s =>
    s.campusZone === activeZone.name ||
    activeZone.coreDomains.some(d => s.skills.some(sk => sk.name.toLowerCase().includes(d.toLowerCase().split(' ')[0])))
  );

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold">
            SYNTHETIC ECOSYSTEM MAP
          </span>
          <h1 className="text-3xl sm:text-5xl font-headline font-extrabold text-primary mb-3">
            THE CAMPUS
          </h1>
          <p className="text-base font-body text-on-surface-variant">
            One campus. A ridiculous amount of talent. Explore specialized labs, department clusters, and live station telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddDepartment}
            className="px-5 py-3 bg-surface dark:bg-surface-container border border-outline-variant rounded-full font-headline text-xs font-bold text-on-surface hover:bg-surface-variant transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-tertiary">domain</span>
            <span>+ ADD DEPARTMENT</span>
          </button>

          <button
            onClick={onOpenAddCampus}
            className="px-5 py-3 bg-primary-container text-on-primary-container rounded-full font-headline text-xs font-bold shadow-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">apartment</span>
            <span>+ ADD CAMPUS</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex gap-2 p-1 rounded-2xl bg-surface-container w-fit border border-outline-variant/40 font-headline text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('map')}
          className={`px-5 py-2 rounded-xl transition-all ${
            activeSubTab === 'map'
              ? 'bg-surface dark:bg-surface-container-high text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          📍 Interactive Campus Map
        </button>

        <button
          onClick={() => setActiveSubTab('departments')}
          className={`px-5 py-2 rounded-xl transition-all ${
            activeSubTab === 'departments'
              ? 'bg-surface dark:bg-surface-container-high text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          🏢 Academic Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('campuses')}
          className={`px-5 py-2 rounded-xl transition-all ${
            activeSubTab === 'campuses'
              ? 'bg-surface dark:bg-surface-container-high text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          🌐 Campus Locations ({campuses.length})
        </button>
      </div>

      {/* SubTab 1: Interactive Illustrated Map */}
      {activeSubTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Canvas */}
          <div className="lg:col-span-8 bento-card rounded-3xl p-6 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <span className="font-headline text-xs font-bold text-on-surface-variant uppercase">
                SRM INNOVATION GRID • LIVE TOPOLOGY
              </span>
              <span className="flex items-center gap-1.5 text-xs font-headline text-green-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                8 Zones Active
              </span>
            </div>

            {/* Visual Illustrated Map Plane */}
            <div className="relative w-full h-80 my-4 bg-surface-bright rounded-2xl border border-outline-variant/40 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Soft Grid Lines */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(var(--outline) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Connecting Topology Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="20%" y1="25%" x2="48%" y2="18%" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="48%" y1="18%" x2="78%" y2="22%" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="78%" y1="22%" x2="82%" y2="65%" stroke="var(--tertiary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="82%" y1="65%" x2="48%" y2="78%" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="48%" y1="78%" x2="18%" y2="72%" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="18%" y1="72%" x2="32%" y2="48%" stroke="var(--tertiary)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="32%" y1="48%" x2="65%" y2="48%" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Zone Pins */}
              {CAMPUS_ZONES.map(zone => {
                const isSelected = activeZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone)}
                    style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl font-headline text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container scale-110 ring-4 ring-primary-container/30 z-20'
                        : 'bg-surface dark:bg-surface-container text-on-surface border border-outline-variant hover:scale-105 z-10'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }}></span>
                    <span>{zone.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-headline text-on-surface-variant z-10">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span> AI & Robotics
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span> Core Systems
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span> Bio & Environment
              </span>
            </div>
          </div>

          {/* Zone Detail Inspector Sidebar */}
          <div className="lg:col-span-4 bento-card rounded-3xl p-6 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-headline font-bold">
                  {activeZone.code}
                </span>
                <span className="text-xs font-headline text-on-surface-variant">
                  {stationedStudents.length} Students Stationed
                </span>
              </div>

              <h3 className="text-2xl font-headline font-extrabold text-on-surface">
                {activeZone.name}
              </h3>
              <p className="text-xs font-headline font-bold text-primary mt-0.5">
                {activeZone.tagline}
              </p>
              <p className="text-xs font-body text-on-surface-variant mt-2 leading-relaxed">
                {activeZone.description}
              </p>
            </div>

            {/* Zone Telemetry */}
            <div className="grid grid-cols-3 gap-2 text-center font-headline text-xs">
              <div className="p-2.5 rounded-xl bg-surface-container">
                <span className="text-[9px] text-on-surface-variant block uppercase">GPU LOAD</span>
                <span className="font-extrabold text-primary">{activeZone.telemetry.gpuLoad}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container">
                <span className="text-[9px] text-on-surface-variant block uppercase">EXPERIMENTS</span>
                <span className="font-extrabold text-secondary">{activeZone.telemetry.activeExperiments}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container">
                <span className="text-[9px] text-on-surface-variant block uppercase">UTILIZATION</span>
                <span className="font-extrabold text-tertiary">{activeZone.telemetry.talentUtilization}</span>
              </div>
            </div>

            {/* Stationed Talents */}
            <div className="space-y-2">
              <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface block">
                Stationed Talents & Researchers:
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stationedStudents.slice(0, 4).map(s => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
                        <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-headline font-bold text-xs text-on-surface block leading-tight">
                          {s.name}
                        </span>
                        <span className="font-body text-[10px] text-on-surface-variant block">
                          {s.role}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Departments Grid */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="bento-card rounded-3xl p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => onEditDepartment(dept)}
                      className="p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setDeptToDelete(dept)}
                      className="p-1 rounded-lg hover:bg-error-container text-error"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-headline font-extrabold text-on-surface text-lg mb-1 group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs font-headline font-bold text-tertiary mb-3">
                  {dept.campus}
                </p>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-4 min-h-[36px]">
                  {dept.description}
                </p>

                {/* Core Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {dept.coreSkills.map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-headline font-bold text-on-surface"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 text-xs font-headline text-on-surface-variant flex items-center justify-between">
                <span>Research Hub</span>
                <span className="text-primary font-bold">Verified Dept</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SubTab 3: Campuses Grid */}
      {activeSubTab === 'campuses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campuses.map(camp => (
            <div
              key={camp.id}
              className="bento-card rounded-3xl p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">apartment</span>
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => onEditCampus(camp)}
                      className="p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setCampusToDelete(camp)}
                      className="p-1 rounded-lg hover:bg-error-container text-error"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-headline font-extrabold text-on-surface text-lg mb-1 group-hover:text-primary transition-colors">
                  {camp.name}
                </h3>
                <p className="text-xs font-headline font-bold text-secondary mb-3">
                  📍 {camp.location}
                </p>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-4 min-h-[48px]">
                  {camp.description}
                </p>

                {/* Labs */}
                <div className="space-y-1 text-xs font-body mb-4">
                  <span className="font-headline font-bold text-[10px] uppercase text-on-surface-variant block">
                    FACILITIES & LABS:
                  </span>
                  {camp.labs.map(lab => (
                    <div key={lab} className="flex items-center gap-1 text-on-surface text-[11px]">
                      <span className="material-symbols-outlined text-xs text-primary">science</span>
                      <span>{lab}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 text-xs font-headline text-on-surface-variant flex items-center justify-between">
                <span>SRM Innovation Grid</span>
                <span className="text-green-600 font-bold">● Active Hub</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Department Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={() => {
          if (deptToDelete) deleteDepartment(deptToDelete.id);
        }}
        title="Delete Academic Department?"
        itemName={deptToDelete?.name || ''}
        message="This will remove the department definition. Existing students with this department tag will remain intact."
      />

      {/* Delete Campus Confirmation */}
      <DeleteConfirmModal
        isOpen={!!campusToDelete}
        onClose={() => setCampusToDelete(null)}
        onConfirm={() => {
          if (campusToDelete) deleteCampus(campusToDelete.id);
        }}
        title="Remove Campus Facility?"
        itemName={campusToDelete?.name || ''}
        message="This will remove this campus hub location from the registered university network."
      />
    </div>
  );
};
