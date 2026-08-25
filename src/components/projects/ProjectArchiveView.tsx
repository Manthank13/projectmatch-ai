import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectArchetype } from '../../types';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface ProjectArchiveViewProps {
  onOpenAddProject: () => void;
  onEditProject: (project: ProjectArchetype) => void;
  onArchitectProject: (project: ProjectArchetype) => void;
}

export const ProjectArchiveView: React.FC<ProjectArchiveViewProps> = ({
  onOpenAddProject,
  onEditProject,
  onArchitectProject
}) => {
  const { projects, deleteProject } = useData();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [projectToDelete, setProjectToDelete] = useState<ProjectArchetype | null>(null);

  const filters = [
    'ALL',
    'AI × ENVIRONMENT',
    'AI × ROBOTICS',
    'AI × AGRICULTURE',
    'DISASTER RESPONSE',
    'OPTIMIZATION'
  ];

  const filteredProjects = projects.filter(p => {
    if (selectedFilter === 'ALL') return true;
    const projectTag = (p.tag || (p.tags ? p.tags[0] : '')).toUpperCase();
    return projectTag.includes(selectedFilter);
  });

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold">
            SYNTHETIC PROJECT ARCHETYPES
          </span>
          <h1 className="text-3xl sm:text-5xl font-headline font-extrabold text-primary mb-3">
            PROJECTS PEOPLE ARE BUILDING
          </h1>
          <p className="text-base font-body text-on-surface-variant">
            From AI satellites to campus rovers. Jump into an existing challenge archetype or publish your own brief.
          </p>
        </div>

        <button
          onClick={onOpenAddProject}
          className="px-8 py-4 bg-primary-container text-on-primary-container rounded-full font-headline text-sm font-bold shadow-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">post_add</span>
          <span>+ CREATE PROJECT</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex overflow-x-auto pb-2 gap-2 w-full no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-4 py-2 rounded-full font-headline text-xs font-bold whitespace-nowrap transition-all ${
              selectedFilter === f
                ? 'bg-primary-container text-on-primary-container shadow-soft scale-105'
                : 'bg-surface dark:bg-surface-container border border-outline-variant/60 text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="bento-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              {/* Header: Movie Tag & Actions */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[11px] font-extrabold tracking-wide">
                  {project.movieTag}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => onEditProject(project)}
                    className="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant"
                    title="Edit Brief"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-1.5 rounded-lg hover:bg-error-container text-error"
                    title="Archive Project"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl p-2 rounded-2xl bg-surface-container flex-shrink-0">
                  {project.icon}
                </span>
                <div>
                  <h3 className="font-headline font-extrabold text-on-surface text-lg leading-snug group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs font-headline font-bold text-tertiary">
                    {project.tag}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-4 min-h-[48px] line-clamp-3">
                {project.description}
              </p>

              {/* Requirements Chips */}
              <div className="space-y-2 mb-4 text-xs font-headline">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    MANDATORY CAPABILITIES:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.mandatorySkills.slice(0, 3).map(sk => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[10px] font-bold"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer: Metadata & Architect Trigger */}
            <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between gap-2">
              <div className="text-xs font-headline text-on-surface-variant flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm text-primary">group</span>
                  <span>{project.teamSize}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                  <span>{project.minAvailability}h/wk</span>
                </span>
              </div>

              <button
                onClick={() => onArchitectProject(project)}
                className="px-4 py-2 bg-on-surface text-surface dark:bg-primary-container dark:text-on-primary-container rounded-full font-headline text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-1"
              >
                <span>✦ ARCHITECT</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
          }
        }}
        title="Archive Project Brief?"
        itemName={projectToDelete?.title || ''}
        message="This project challenge will be removed from the active projects archive."
      />
    </div>
  );
};
