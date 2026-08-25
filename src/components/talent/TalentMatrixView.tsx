import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { StudentModal } from './StudentModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { CampusNetworkGraph } from './CampusNetworkGraph';
import { GlassDropdown } from '../common/GlassDropdown';
import { ProfileLinks } from '../common/ProfileLinks';
import { getStudentAvatar } from '../../utils/avatar';

interface TalentMatrixViewProps {
  onOpenAddStudent: () => void;
  onOpenAddProject: () => void;
  onEditStudent: (student: Student) => void;
  onNavigateToArchitect?: () => void;
}

export const TalentMatrixView: React.FC<TalentMatrixViewProps> = ({
  onOpenAddStudent,
  onOpenAddProject,
  onEditStudent,
  onNavigateToArchitect
}) => {
  const { students, departments, campuses, deleteStudent } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced Filter state
  const [filterCampus, setFilterCampus] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterAvailability, setFilterAvailability] = useState('ALL');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filters = [
    'ALL',
    'AI / ML',
    'CSE',
    'DESIGN',
    'BIOTECH',
    'ENVIRONMENT',
    'ECE',
    'ROBOTICS',
    'DATA'
  ];

  // Domain badge color helper
  const getDomainColor = (category: string) => {
    switch (category) {
      case 'AI / ML':
        return '#00E5FF';
      case 'CSE':
      case 'BACKEND':
        return '#8B5CF6';
      case 'DESIGN':
      case 'PRODUCT':
        return '#EC4899';
      case 'BIOTECH':
      case 'ENVIRONMENT':
        return '#10B981';
      case 'ROBOTICS':
      case 'ECE':
        return '#F59E0B';
      default:
        return '#38BDF8';
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some(sk => sk.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedFilter === 'ALL' ||
        student.domains.some(d => d === selectedFilter) ||
        student.skills.some(sk => sk.category === selectedFilter) ||
        student.department.toUpperCase().includes(selectedFilter);

      const matchesCampus =
        filterCampus === 'ALL' ||
        (student.campus && student.campus.includes(filterCampus));

      const matchesDept =
        filterDept === 'ALL' ||
        student.department.includes(filterDept);

      const matchesAvailability =
        filterAvailability === 'ALL' ||
        (filterAvailability === '12+' && student.availabilityHours >= 12) ||
        (filterAvailability === '15+' && student.availabilityHours >= 15);

      return matchesSearch && matchesCategory && matchesCampus && matchesDept && matchesAvailability;
    });
  }, [students, searchQuery, selectedFilter, filterCampus, filterDept, filterAvailability]);

  // Total unique skills count
  const allSkillsSet = new Set<string>();
  students.forEach(s => s.skills.forEach(sk => allSkillsSet.add(sk.name)));

  return (
    <div className="space-y-10 py-6 animate-fadeIn relative z-10">
      {/* Editorial Header Section */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pt-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-headline font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
            <span>✦ SRM INNOVATION GRID TALENT INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-headline font-extrabold text-on-surface tracking-tight leading-[1.05]">
            MEET<br />
            <span className="gradient-cyan-violet">THE TALENT.</span>
          </h1>

          <div className="space-y-0.5">
            <p className="text-base sm:text-lg font-headline font-bold text-on-surface">
              "People are more interesting than résumés."
            </p>
            <p className="text-xs sm:text-sm font-body text-on-surface-variant max-w-xl leading-relaxed">
              Discover the skills, projects and people shaping your university. Designed to construct complementary hackathon, research, and startup teams.
            </p>
          </div>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddStudent}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ ADD YOURSELF</span>
          </button>

          {onNavigateToArchitect && (
            <button
              onClick={onNavigateToArchitect}
              className="px-6 py-3.5 rounded-full glass-button hover:bg-white/[0.08] text-on-surface font-headline text-xs font-bold border border-cyan-400/30 text-cyan-300 hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-cyan-400">psychology</span>
              <span>ARCHITECT TEAM →</span>
            </button>
          )}
        </div>
      </section>

      {/* Live Network Statistics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-headline">
        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            STUDENTS INDEXED
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-on-surface leading-none">
              {students.length}
            </span>
            <span className="text-xs text-cyan-400 font-bold">ACTIVE</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            SKILL DOMAINS
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 leading-none">
              {allSkillsSet.size || 14}
            </span>
            <span className="text-xs text-violet-300 font-bold">MAPPED</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            CAMPUS CHALLENGES
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-mint-accent leading-none">
              06
            </span>
            <span className="text-xs text-mint-glow font-bold">BENCHMARKS</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            TALENT COVERAGE
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 leading-none">
              97.4%
            </span>
            <span className="text-xs text-cyan-300 font-bold">SYNERGY</span>
          </div>
        </div>
      </section>

      {/* Floating Search Capsule + Filter Control Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Horizontal Glass Filter Tabs */}
          <div className="flex overflow-x-auto pb-1 gap-1.5 w-full md:w-auto no-scrollbar p-1 rounded-full bg-surface/80 border border-outline-variant">
            {filters.map(filter => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full font-headline text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/50 text-cyan-300 shadow-cyan-glow scale-105'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Search Capsule with ⌘K Badge & Filters Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search people, skills, tools..."
                className="w-full pl-9 pr-14 py-2.5 rounded-full glass-input text-xs font-headline text-on-surface"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-on-surface-variant border border-outline-variant pointer-events-none">
                ⌘K
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-1 text-xs font-headline font-bold ${
                showAdvancedFilters
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-glow'
                  : 'glass-input text-on-surface hover:bg-white/[0.06]'
              }`}
              title="Toggle Advanced Filters"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Glass Filter Drawer */}
        {showAdvancedFilters && (
          <div className="p-5 rounded-3xl glass-dropdown border border-outline-variant animate-fadeIn grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassDropdown
              label="Campus Location"
              value={filterCampus}
              options={['ALL', ...campuses.map(c => c.name || '')]}
              onChange={setFilterCampus}
              icon="apartment"
            />

            <GlassDropdown
              label="Department Cluster"
              value={filterDept}
              options={['ALL', ...departments.map(d => d.name || '')]}
              onChange={setFilterDept}
              searchable
              icon="domain"
            />

            <GlassDropdown
              label="Minimum Availability"
              value={filterAvailability}
              options={[
                { value: 'ALL', label: 'All Availability' },
                { value: '12+', label: '12+ Hours / Week' },
                { value: '15+', label: '15+ Hours / Week' }
              ]}
              onChange={setFilterAvailability}
              icon="schedule"
            />
          </div>
        )}
      </section>

      {/* Main Grid Layout: Talent Cards Grid + Aligned Topology Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Candidates Grid (8 cols on large screens) */}
        <div className="lg:col-span-8 w-full">
          {filteredStudents.length === 0 ? (
            <div className="glass-identity-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-outline-variant flex items-center justify-center text-cyan-400">
                <span className="material-symbols-outlined text-3xl">person_search</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">
                "Your squad is currently empty."
              </h3>
              <p className="text-xs font-body text-on-surface-variant max-w-sm">
                No candidates match your current filter selection. Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('ALL');
                  setFilterCampus('ALL');
                  setFilterDept('ALL');
                  setFilterAvailability('ALL');
                }}
                className="px-6 py-2.5 rounded-full bg-cyan-500 text-space-black font-headline text-xs font-bold shadow-cyan-glow hover:scale-105"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredStudents.map((student, index) => {
                const photoSrc = getStudentAvatar(student);
                const isRealUser = !!student.isUserCreated;
                const proofScore = student.proofOfWorkScore || 92;

                return (
                  <div
                    key={student.id}
                    style={{ animationDelay: `${index * 40}ms` }}
                    className="glass-identity-card rounded-3xl p-6 h-full flex flex-col justify-between relative group hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div>
                      {/* Top Bar: Profile Photo & Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Photo with Luminous Halo */}
                          <div
                            onClick={() => setSelectedStudent(student)}
                            className="relative w-14 h-14 rounded-2xl overflow-hidden border border-cyan-400/40 shadow-cyan-glow cursor-pointer group-hover:scale-105 transition-transform bg-surface flex-shrink-0"
                          >
                            <img
                              src={photoSrc}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3
                                onClick={() => setSelectedStudent(student)}
                                className="font-headline font-extrabold text-on-surface text-base cursor-pointer hover:text-cyan-300 transition-colors truncate max-w-[130px]"
                              >
                                {student.name}
                              </h3>
                              {/* Synthetic Demo vs Real User Badge */}
                              {isRealUser ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-mint-accent/15 border border-mint-accent/30 text-mint-accent text-[9px] font-headline font-extrabold" title="Verified User Identity">
                                  VERIFIED
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-white/10 border border-outline-variant text-on-surface-variant text-[9px] font-mono font-bold" title="Synthetic Benchmark Persona">
                                  SYNTHETIC
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-headline font-bold text-cyan-400 truncate max-w-[150px]">
                              {student.role}
                            </p>
                            <span className="text-[10px] font-body text-on-surface-variant block truncate max-w-[150px]">
                              {student.department.split('-')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Card Options (Edit/Delete) */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); onEditStudent(student); }}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-on-surface-variant hover:text-cyan-300"
                            title="Edit Profile"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setStudentToDelete(student); }}
                            className="p-1.5 rounded-lg hover:bg-error-container text-error"
                            title="Remove Candidate"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Proof of Work & Availability Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-outline-variant/40 text-xs font-headline">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full border border-cyan-400 flex items-center justify-center circular-progress-glow">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          </div>
                          <span className="text-on-surface font-extrabold">{proofScore}%</span>
                          <span className="text-[10px] text-on-surface-variant font-medium">PROOF</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          {student.availabilityHours} hrs/wk
                        </span>
                      </div>

                      {/* Personality One-Liner */}
                      <p className="font-body text-xs text-on-surface-variant italic mb-3 min-h-[32px] line-clamp-2 px-0.5">
                        "{student.personalityLine}"
                      </p>

                      {/* Minimal Skill Capsules with Domain Dots */}
                      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[56px] items-start">
                        {student.skills.slice(0, 3).map(sk => (
                          <span
                            key={sk.name}
                            className="skill-capsule px-2.5 py-1 rounded-full font-headline font-bold text-[11px] text-on-surface flex items-center gap-1.5"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getDomainColor(sk.category) }}
                            />
                            <span>{sk.name}</span>
                            <strong className="text-cyan-400 font-extrabold">{sk.score}</strong>
                          </span>
                        ))}
                      </div>

                      {/* Professional Links Bar */}
                      <div className="mb-2">
                        <ProfileLinks links={student.professionalLinks} size="sm" />
                      </div>
                    </div>

                    {/* Card Footer: View Profile Trigger */}
                    <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between font-headline text-xs mt-2">
                      <span className="text-on-surface-variant text-[11px]">
                        {student.campus?.split('(')[0] || 'Main Campus'}
                      </span>

                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-cyan-400 group-hover:text-cyan-300 font-extrabold flex items-center gap-1 transition-colors"
                      >
                        <span>VIEW PROFILE</span>
                        <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Topology Panel (4 cols on large screens) */}
        <div className="lg:col-span-4 w-full sticky top-24 space-y-6">
          <div className="glass-identity-card rounded-3xl p-6 border border-cyan-400/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-lg font-bold">hub</span>
                <h3 className="font-headline font-extrabold text-on-surface text-base">
                  Talent Topology
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold">
                LIVE DYNAMICS
              </span>
            </div>

            <p className="text-xs font-body text-on-surface-variant mb-4 leading-relaxed">
              Interactive multi-disciplinary talent clustering across {campuses.length} campuses and {departments.length} departments.
            </p>

            <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-space-surface/40 min-h-[300px]">
              <CampusNetworkGraph
                selectedCategory={selectedFilter}
                onSelectCategory={setSelectedFilter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEditStudent={student => {
          setSelectedStudent(null);
          onEditStudent(student);
        }}
      />

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          title="Remove Candidate"
          message={`Are you sure you want to remove ${studentToDelete.name} from the active campus talent pool?`}
          itemName={studentToDelete.name}
          onConfirm={() => {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }}
          onClose={() => setStudentToDelete(null)}
        />
      )}
    </div>
  );
};
