import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, ProjectArchetype, Department, Campus, ActivityItem, ThemeMode } from '../types';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_PROJECTS } from '../data/projects';
import { INITIAL_DEPARTMENTS, INITIAL_CAMPUSES } from '../data/campusNodes';
import { supabase, getAllProfiles, DatabaseProfile } from '../lib/supabase';
import { mergeStudentsWithProfiles, mapProfileToStudent } from '../utils/studentMapper';

interface DataContextType {
  students: Student[];
  projects: ProjectArchetype[];
  departments: Department[];
  campuses: Campus[];
  activityLog: ActivityItem[];
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isProfilesLoading: boolean;
  refreshProfiles: () => Promise<void>;
  // Student CRUD
  addStudent: (student: Partial<Student> & { name: string; department: string }) => Student;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  // Project CRUD
  addProject: (project: Omit<ProjectArchetype, 'id'>) => ProjectArchetype;
  updateProject: (id: string, project: Partial<ProjectArchetype>) => void;
  deleteProject: (id: string) => void;
  // Department CRUD
  addDepartment: (department: Omit<Department, 'id'>) => Department;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  // Campus CRUD
  addCampus: (campus: Omit<Campus, 'id'>) => Campus;
  updateCampus: (id: string, campus: Partial<Campus>) => void;
  deleteCampus: (id: string) => void;
  // Reset
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act-1', text: 'Shrek joined Environmental Science & Forestry.', timeAgo: '2m ago', type: 'student' },
  { id: 'act-2', text: 'Interstellar Ocean Intelligence squad recommendation active.', timeAgo: '8m ago', type: 'project' },
  { id: 'act-3', text: 'Barbie updated Figma design system credentials.', timeAgo: '15m ago', type: 'student' },
  { id: 'act-4', text: 'Tony Stark published Exosuit Biometrics challenge.', timeAgo: '25m ago', type: 'project' },
  { id: 'act-5', text: 'New AI & Machine Learning Lab telemetry synchronized.', timeAgo: '42m ago', type: 'system' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pm_theme');
    return (saved as ThemeMode) || 'light';
  });

  // Loading state for Supabase profiles
  const [isProfilesLoading, setIsProfilesLoading] = useState(false);

  // Students state initialized with merged demo and stored users
  const [students, setStudents] = useState<Student[]>(() => {
    return INITIAL_STUDENTS.map(s => ({
      ...s,
      isSyntheticDemo: true,
      isDemo: true,
      isUserCreated: false
    }));
  });

  // Refresh Profiles from Supabase Postgres
  const refreshProfiles = useCallback(async () => {
    try {
      setIsProfilesLoading(true);
      const profiles = await getAllProfiles();
      if (profiles) {
        setStudents(mergeStudentsWithProfiles(profiles, INITIAL_STUDENTS));
      }
    } catch (err) {
      console.warn('Could not refresh profiles from Supabase:', err);
    } finally {
      setIsProfilesLoading(false);
    }
  }, []);

  // Initial load of Supabase Profiles and Realtime Subscription
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsProfilesLoading(true);
        const profiles = await getAllProfiles();
        if (isMounted && profiles && profiles.length > 0) {
          setStudents(mergeStudentsWithProfiles(profiles, INITIAL_STUDENTS));
        }
      } catch (err) {
        console.warn('Initial profiles load warning:', err);
      } finally {
        if (isMounted) setIsProfilesLoading(false);
      }
    }

    loadData();

    // Supabase Realtime channel to synchronize profiles automatically
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
          if (isMounted) {
            const updated = await getAllProfiles();
            setStudents(mergeStudentsWithProfiles(updated, INITIAL_STUDENTS));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Projects state with localStorage
  const [projects, setProjects] = useState<ProjectArchetype[]>(() => {
    try {
      const saved = localStorage.getItem('pm_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  // Departments state with localStorage
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('pm_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load departments from localStorage', e);
    }
    return INITIAL_DEPARTMENTS;
  });

  // Campuses state with localStorage
  const [campuses, setCampuses] = useState<Campus[]>(() => {
    try {
      const saved = localStorage.getItem('pm_campuses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load campuses from localStorage', e);
    }
    return INITIAL_CAMPUSES;
  });

  // Activities state with localStorage
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('pm_activities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load activities from localStorage', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Sync theme changes to DOM
  useEffect(() => {
    localStorage.setItem('pm_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // System mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [theme]);

  // Persist projects
  useEffect(() => {
    try {
      localStorage.setItem('pm_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  // Persist departments
  useEffect(() => {
    try {
      localStorage.setItem('pm_departments', JSON.stringify(departments));
    } catch (e) {
      console.error('Failed to save departments to localStorage', e);
    }
  }, [departments]);

  // Persist campuses
  useEffect(() => {
    try {
      localStorage.setItem('pm_campuses', JSON.stringify(campuses));
    } catch (e) {
      console.error('Failed to save campuses to localStorage', e);
    }
  }, [campuses]);

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem('pm_activities', JSON.stringify(activityLog));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activityLog]);

  const addActivity = (text: string, type: 'student' | 'project' | 'department' | 'system') => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}`,
      text,
      timeAgo: 'Just now',
      type
    };
    setActivityLog(prev => [newItem, ...prev.slice(0, 19)]);
  };

  // Student CRUD
  const addStudent = (studentData: Partial<Student> & { name: string; department: string }): Student => {
    const studentId = studentData.id || `user-${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      name: studentData.name,
      department: studentData.department,
      campus: studentData.campus || 'Main Campus (Kattankulathur)',
      year: studentData.year || '3rd Year (Junior)',
      role: studentData.role || 'Student Technologist',
      skills: studentData.skills || [{ name: 'Full-Stack Engineering', score: 8, category: 'CSE' }],
      domains: studentData.domains || ['CSE'],
      availabilityHours: studentData.availabilityHours || 14,
      individualFitScore: studentData.individualFitScore || 90,
      marginalTeamValue: studentData.marginalTeamValue || 85,
      uniqueContribution: studentData.uniqueContribution || studentData.bio || 'Systems Architecture & Execution',
      personalityLine: studentData.personalityLine || 'Verified campus builder.',
      avatar: studentData.avatar || studentData.avatarUrl || '',
      avatarUrl: studentData.avatarUrl || studentData.avatar || undefined,
      profileImage: studentData.profileImage || studentData.avatarUrl || undefined,
      bio: studentData.bio || 'Passionate student technologist ready to build high-impact projects.',
      campusZone: studentData.campusZone || 'CAMPUS INNOVATION HUB',
      badges: studentData.badges || ['Verified Member'],
      pastProjects: studentData.pastProjects || [],
      professionalLinks: studentData.professionalLinks || {},
      isUserCreated: true,
      isSyntheticDemo: false,
      isDemo: false
    };

    setStudents(prev => {
      const existingIndex = prev.findIndex(s => s.id === studentId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...newStudent };
        return copy;
      }
      return [newStudent, ...prev];
    });

    addActivity(`${newStudent.name} joined the talent network (${newStudent.department}).`, 'student');
    return newStudent;
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    const target = students.find(s => s.id === id);
    if (target) {
      addActivity(`${target.name} updated profile & competencies.`, 'student');
    }
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (target) {
      addActivity(`${target.name} was removed from the talent network.`, 'student');
    }
  };

  // Project CRUD
  const addProject = (projectData: Omit<ProjectArchetype, 'id'>): ProjectArchetype => {
    const newId = `proj-${Date.now()}`;
    const newProject = {
      ...projectData,
      id: newId,
      isUserCreated: true
    } as ProjectArchetype;
    setProjects(prev => [newProject, ...prev]);
    addActivity(`New project added: "${newProject.title}".`, 'project');
    return newProject;
  };

  const updateProject = (id: string, updatedData: Partial<ProjectArchetype>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    const target = projects.find(p => p.id === id);
    if (target) {
      addActivity(`Project "${target.title}" requirements updated.`, 'project');
    }
  };

  const deleteProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (target) {
      addActivity(`Project "${target.title}" was archived.`, 'project');
    }
  };

  // Department CRUD
  const addDepartment = (deptData: Omit<Department, 'id'>): Department => {
    const newId = `dept-${Date.now()}`;
    const newDept = {
      ...deptData,
      id: newId
    } as Department;
    setDepartments(prev => [...prev, newDept]);
    addActivity(`New academic department added: ${newDept.name}.`, 'department');
    return newDept;
  };

  const updateDepartment = (id: string, updatedData: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updatedData } : d));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // Campus CRUD
  const addCampus = (campusData: Omit<Campus, 'id'>): Campus => {
    const newId = `camp-${Date.now()}`;
    const newCampus = {
      ...campusData,
      id: newId
    } as Campus;
    setCampuses(prev => [...prev, newCampus]);
    addActivity(`New campus facility registered: ${newCampus.name}.`, 'system');
    return newCampus;
  };

  const updateCampus = (id: string, updatedData: Partial<Campus>) => {
    setCampuses(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCampus = (id: string) => {
    setCampuses(prev => prev.filter(c => c.id !== id));
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setCampuses(INITIAL_CAMPUSES);
    setActivityLog(INITIAL_ACTIVITIES);
    localStorage.removeItem('pm_students');
    localStorage.removeItem('pm_projects');
    localStorage.removeItem('pm_departments');
    localStorage.removeItem('pm_campuses');
    localStorage.removeItem('pm_activities');
    refreshProfiles();
    addActivity('Synthetic demo dataset restored to pristine default state.', 'system');
  };

  return (
    <DataContext.Provider
      value={{
        students,
        projects,
        departments,
        campuses,
        activityLog,
        theme,
        setTheme: setThemeState,
        isProfilesLoading,
        refreshProfiles,
        addStudent,
        updateStudent,
        deleteStudent,
        addProject,
        updateProject,
        deleteProject,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addCampus,
        updateCampus,
        deleteCampus,
        resetDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
