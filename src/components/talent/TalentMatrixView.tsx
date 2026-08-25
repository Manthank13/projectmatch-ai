import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';
import { StudentModal } from './StudentModal';
import { TalentCard } from './TalentCard';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { GlassDropdown } from '../common/GlassDropdown';
import { CampusNetworkGraph } from './CampusNetworkGraph';

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
  const { students, deleteStudent, departments, campuses, isProfilesLoading, refreshProfiles } = useData();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [filterCampus, setFilterCampus] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterAvailability, setFilterAvailability] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Search hotkey (⌘K / Ctrl+K)
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    'CAMPUS MEMBERS',
    'DEMO SHOWCASE',
    'AI / ML',
    'CSE',
    'DESIGN',
    'BIOTECH',
    'ENVIRONMENT',
    'ECE',
    'ROBOTICS',
    'DATA'
  ];

  // Filter students based on all active criteria
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = student.name.toLowerCase().includes(query);
        const roleMatch = student.role.toLowerCase().includes(query);
        const deptMatch = student.department.toLowerCase().includes(query);
        const campusMatch = student.campus.toLowerCase().includes(query);
        const skillsMatch = student.skills.some(s => s.name.toLowerCase().includes(query));
        const domainsMatch = student.domains.some(d => d.toLowerCase().includes(query));
        const bioMatch = (student.bio || '').toLowerCase().includes(query);
        if (!nameMatch && !roleMatch && !deptMatch && !campusMatch && !skillsMatch && !domainsMatch && !bioMatch) {
          return false;
        }
      }

      // 2. Primary Domain / Category Filter
      if (selectedFilter === 'CAMPUS MEMBERS') {
        if (!student.isUserCreated && student.isSyntheticDemo !== false) return false;
      } else if (selectedFilter === 'DEMO SHOWCASE') {
        if (student.isUserCreated) return false;
      } else if (selectedFilter !== 'ALL') {
        const hasDomain = student.domains.some(d => d.toUpperCase().includes(selectedFilter.toUpperCase()));
        const hasSkillCategory = student.skills.some(s => s.category.toUpperCase().includes(selectedFilter.toUpperCase()));
        const hasSkillName = student.skills.some(s => s.name.toUpperCase().includes(selectedFilter.toUpperCase()));
        if (!hasDomain && !hasSkillCategory && !hasSkillName) {
          return false;
        }
      }

      // 3. Campus Filter
      if (filterCampus !== 'ALL' && !student.campus.includes(filterCampus)) {
        return false;
      }

      // 4. Department Filter
      if (filterDept !== 'ALL' && !student.department.includes(filterDept)) {
        return false;
      }

      // 5. Availability Filter
      if (filterAvailability !== 'ALL') {
        const minHours = parseInt(filterAvailability, 10);
        if (student.availabilityHours < minHours) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, selectedFilter, filterCampus, filterDept, filterAvailability]);

  // Aggregate all unique skills
  const allSkillsSet = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => s.skills.forEach(sk => set.add(sk.name)));
    return set;
  }, [students]);

  const getDomainColor = (category: string) => {
    switch (category) {
      case 'AI / ML': return '#00E5FF';
      case 'CSE':
      case 'BACKEND': return '#8B5CF6';
      case 'BIOTECH': return '#10B981';
      case 'DESIGN': return '#EC4899';
      case 'ROBOTICS':
      case 'ECE': return '#F59E0B';
      case 'ENVIRONMENT': return '#34D399';
      default: return '#00E5FF';
    }
  };

  return (
    <div className="space-y-8 py-6 w-full max-w-full min-w-0 animate-fadeIn">
      {/* Editorial Headline & Mission Bar */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-headline font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
            <span>CAMPUS TALENT NETWORK</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
              PEOPLE IN THE NETWORK
            </h1>
            <p className="text-xs sm:text-sm font-body text-on-surface-variant max-w-xl leading-relaxed mt-2">
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
              className="px-6 py-3.5 rounded-full glass-input hover:bg-white/[0.08] dark:hover:bg-white/[0.08] text-cyan-600 dark:text-cyan-300 font-headline text-xs font-bold border border-cyan-400/30 hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-cyan-500 dark:text-cyan-400">psychology</span>
              <span>ARCHITECT TEAM →</span>
            </button>
          )}
        </div>
      </section>

      {/* Live Network Statistics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-headline w-full min-w-0">
        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between h-full min-w-0">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            STUDENTS INDEXED
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-on-surface leading-none">
              {students.length}
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">ACTIVE</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between h-full min-w-0">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            SKILL DOMAINS
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400 leading-none">
              {allSkillsSet.size || 14}
            </span>
            <span className="text-xs text-violet-500 dark:text-violet-300 font-bold">MAPPED</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between h-full min-w-0">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            CAMPUS CHALLENGES
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-mint-accent leading-none">
              06
            </span>
            <span className="text-xs text-emerald-500 dark:text-mint-glow font-bold">BENCHMARKS</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl glass-identity-card border border-outline-variant flex flex-col justify-between h-full min-w-0">
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
            TALENT COVERAGE
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 leading-none">
              97.4%
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-300 font-bold">SYNERGY</span>
          </div>
        </div>
      </section>

      {/* Floating Search Capsule + Filter Control Bar */}
      <section className="space-y-4 w-full min-w-0">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full min-w-0">
          {/* Horizontal Glass Filter Tabs */}
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex overflow-x-auto pb-1 gap-1.5 w-full no-scrollbar p-1.5 rounded-full glass-filter-bar">
              {filters.map(filter => {
                const isActive = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-full font-headline text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/20 dark:from-cyan-500/25 dark:to-violet-500/25 border border-sky-500/50 dark:border-cyan-400/50 text-slate-900 dark:text-cyan-300 shadow-sm dark:shadow-cyan-glow scale-105 font-extrabold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Capsule with ⌘K Badge & Filters Toggle */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-shrink-0">
            <div className="relative flex-1 lg:w-80">
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
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/10 dark:bg-white/10 text-[10px] font-mono text-on-surface-variant border border-outline-variant pointer-events-none">
                ⌘K
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-1 text-xs font-headline font-bold cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-cyan-glow'
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
          <div className="p-5 rounded-3xl glass-dropdown border border-outline-variant animate-fadeIn grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
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
                { value: 'ALL', label: 'All Availability Tiers' },
                { value: '8', label: '8+ Hours / Week' },
                { value: '12', label: '12+ Hours / Week' },
                { value: '16', label: '16+ Hours / Week' },
                { value: '20', label: '20+ Hours / Week (Full Squad)' }
              ]}
              onChange={setFilterAvailability}
              icon="schedule"
            />
          </div>
        )}
      </section>

      {/* Main Grid Layout: Talent Cards Grid + Topology Panel in Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,0.95fr)] gap-6 items-start w-full min-w-0">
        {/* Candidates Section (3 columns on wide screens) */}
        <div className="col-span-1 md:col-span-2 xl:col-span-3 w-full min-w-0">
          {filteredStudents.length === 0 ? (
            <div className="glass-identity-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-outline-variant flex items-center justify-center text-cyan-500 dark:text-cyan-400">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full min-w-0">
              {filteredStudents.map((student) => (
                <TalentCard
                  key={student.id}
                  student={student}
                  onSelect={setSelectedStudent}
                  onEdit={onEditStudent}
                  onDelete={setStudentToDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Topology Panel (4th column on wide screens, responsive sidebar) */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1 w-full min-w-0 sticky top-24">
          <div className="glass-identity-card rounded-3xl p-6 border border-cyan-400/30 w-full min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-lg font-bold">hub</span>
                <h3 className="font-headline font-extrabold text-on-surface text-base">
                  Talent Topology
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold">
                LIVE NODES
              </span>
            </div>

            <p className="text-xs font-body text-on-surface-variant mb-4 leading-relaxed">
              Multi-disciplinary talent clustering across {campuses.length} campuses and {departments.length} departments.
            </p>

            <div className="w-full min-w-0">
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
