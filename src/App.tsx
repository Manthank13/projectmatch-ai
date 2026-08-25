import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroInput } from './components/architect/HeroInput';
import { AnalysisSequence } from './components/architect/AnalysisSequence';
import { ArchitectDashboard } from './components/architect/ArchitectDashboard';
import { TalentMatrixView } from './components/talent/TalentMatrixView';
import { ProjectArchiveView } from './components/projects/ProjectArchiveView';
import { CampusCommandCenter } from './components/campus/CampusCommandCenter';
import { HowItWorksView } from './components/howitworks/HowItWorksView';
import { ProfilePage } from './components/profile/ProfilePage';
import { StudentModal } from './components/talent/StudentModal';
import { MultiStepProfileModal } from './components/modals/MultiStepProfileModal';
import { ProjectFormModal } from './components/modals/ProjectFormModal';
import { DepartmentModal } from './components/modals/DepartmentModal';
import { CampusModal } from './components/modals/CampusModal';
import { AdminControlModal } from './components/modals/AdminControlModal';

// Auth Pages
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';

import { recommendTeamAI } from './services/aiService';
import { Student, ProjectArchetype, Department, Campus, TeamArchitectResult } from './types';
import { playChime, playSuccess, playWhoosh } from './utils/sound';

type AppRoute =
  | 'architect'
  | 'talent'
  | 'projects'
  | 'campus'
  | 'how-it-works'
  | 'profile'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email';

const MainApp: React.FC = () => {
  const { students, projects, updateStudent, addStudent } = useData();
  const { user, isAuthenticated } = useAuth();

  // Route state initialized from pathname
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (path === 'login') return 'login';
    if (path === 'signup') return 'signup';
    if (path === 'forgot-password') return 'forgot-password';
    if (path === 'reset-password') return 'reset-password';
    if (path === 'verify-email') return 'verify-email';
    if (path === 'profile') return 'profile';
    if (path === 'talent') return 'talent';
    if (path === 'projects') return 'projects';
    if (path === 'campus') return 'campus';
    if (path === 'how-it-works') return 'how-it-works';
    return 'architect';
  });

  // Sync browser History API
  const navigateTo = (route: string) => {
    const validRoute = route as AppRoute;
    setCurrentRoute(validRoute);
    window.history.pushState(null, '', `/${validRoute === 'architect' ? '' : validRoute}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (
        path === 'login' ||
        path === 'signup' ||
        path === 'forgot-password' ||
        path === 'reset-password' ||
        path === 'verify-email' ||
        path === 'profile' ||
        path === 'talent' ||
        path === 'projects' ||
        path === 'campus' ||
        path === 'how-it-works'
      ) {
        setCurrentRoute(path as AppRoute);
      } else {
        setCurrentRoute('architect');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync authenticated user into the talent pool as a verified user profile
  useEffect(() => {
    if (user && user.id) {
      const existing = students.find(s => s.id === user.id || s.contactEmail === user.email);
      if (existing) {
        // Update with latest user attributes
        updateStudent(existing.id, {
          name: user.fullName || existing.name,
          role: user.role || existing.role,
          department: user.department || existing.department,
          campus: user.campus || existing.campus,
          avatarUrl: user.avatarUrl,
          bio: user.bio || existing.bio,
          skills: user.skills && user.skills.length > 0 ? user.skills : existing.skills,
          availabilityHours: user.availabilityHours || existing.availabilityHours,
          isUserCreated: true,
          isSyntheticDemo: false
        });
      }
    }
  }, [user]);

  const [prompt, setPrompt] = useState(
    "We're building an AI platform that detects ocean pollution using satellite and environmental data."
  );

  // Architect State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TeamArchitectResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal States
  const [studentModalTarget, setStudentModalTarget] = useState<Student | null>(null);

  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectArchetype | null>(null);

  const [isDeptFormOpen, setIsDeptFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [isCampusFormOpen, setIsCampusFormOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Trigger squad architecting
  const handleArchitect = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || prompt;
    if (!textToAnalyze.trim()) return;

    playWhoosh();
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setErrorMessage(null);
    navigateTo('architect');

    try {
      const realResult = await recommendTeamAI(textToAnalyze, students, projects);
      setAnalysisResult(realResult);
      setIsAnalyzing(false);
      playSuccess();
    } catch (err: any) {
      console.error('[App] Gemini AI Execution Error:', err);
      setIsAnalyzing(false);
      setErrorMessage(err?.message || 'Failed to reach Gemini API. Please check your GEMINI_API_KEY.');
    }
  };

  const handleArchitectProject = (proj: ProjectArchetype) => {
    setPrompt(proj.description);
    handleArchitect(proj.description);
  };

  const isAuthRoute = ['login', 'signup', 'forgot-password', 'reset-password', 'verify-email'].includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background transition-colors duration-300 font-body relative">
      {/* Ambient background mesh */}
      <div className="ambient-network-bg" />

      {/* Render Authentication Routes */}
      {currentRoute === 'login' && (
        <LoginPage
          onNavigate={navigateTo}
          onSuccess={() => navigateTo('architect')}
        />
      )}

      {currentRoute === 'signup' && (
        <SignUpPage
          onNavigate={navigateTo}
        />
      )}

      {currentRoute === 'forgot-password' && (
        <ForgotPasswordPage
          onNavigate={navigateTo}
        />
      )}

      {currentRoute === 'reset-password' && (
        <ResetPasswordPage
          onNavigate={navigateTo}
        />
      )}

      {currentRoute === 'verify-email' && (
        <VerifyEmailPage
          onNavigate={navigateTo}
        />
      )}

      {/* Render Main Application Routes */}
      {!isAuthRoute && (
        <>
          {/* Floating Glass Capsule Navigation */}
          <Navbar
            activeTab={currentRoute as any}
            setActiveTab={t => navigateTo(t)}
            onOpenAddStudent={() => {
              if (!isAuthenticated) {
                navigateTo('login');
              } else {
                setEditingStudent(null);
                setIsStudentFormOpen(true);
              }
            }}
            onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
            onOpenAddDepartment={() => { setEditingDept(null); setIsDeptFormOpen(true); }}
            onOpenAddCampus={() => { setEditingCampus(null); setIsCampusFormOpen(true); }}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onNavigateAuth={route => navigateTo(route)}
          />

          {/* Main Content Area */}
          <main className="app-page-container flex-1 pt-4 pb-16 relative z-10">
            {currentRoute === 'architect' && (
              <>
                {errorMessage && (
                  <div className="max-w-2xl mx-auto my-6 p-6 rounded-3xl bg-error-container border border-error text-on-error-container space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl text-error">error</span>
                      <div>
                        <h3 className="font-headline font-extrabold text-base">
                          AI CONNECTION ERROR
                        </h3>
                        <p className="text-xs font-body opacity-90">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setErrorMessage(null)}
                        className="px-4 py-1.5 rounded-full hover:bg-white/10 text-xs font-headline font-bold"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleArchitect(prompt)}
                        className="px-5 py-1.5 rounded-full bg-error text-white font-headline text-xs font-extrabold shadow-sm hover:scale-105"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  </div>
                )}

                {isAnalyzing ? (
                  <AnalysisSequence onComplete={() => {}} />
                ) : analysisResult ? (
                  <ArchitectDashboard
                    result={analysisResult}
                    onReArchitect={() => {
                      setAnalysisResult(null);
                      playChime();
                    }}
                    onSelectStudent={s => setStudentModalTarget(s)}
                  />
                ) : (
                  <HeroInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onArchitect={handleArchitect}
                    onExploreTalent={() => navigateTo('talent')}
                    isAnalyzing={isAnalyzing}
                  />
                )}
              </>
            )}

            {currentRoute === 'talent' && (
              <TalentMatrixView
                onOpenAddStudent={() => {
                  if (!isAuthenticated) {
                    navigateTo('login');
                  } else {
                    setEditingStudent(null);
                    setIsStudentFormOpen(true);
                  }
                }}
                onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
                onEditStudent={s => { setEditingStudent(s); setIsStudentFormOpen(true); }}
                onNavigateToArchitect={() => navigateTo('architect')}
              />
            )}

            {currentRoute === 'projects' && (
              <ProjectArchiveView
                onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
                onEditProject={p => { setEditingProject(p); setIsProjectFormOpen(true); }}
                onArchitectProject={handleArchitectProject}
              />
            )}

            {currentRoute === 'campus' && (
              <CampusCommandCenter
                onOpenAddDepartment={() => { setEditingDept(null); setIsDeptFormOpen(true); }}
                onOpenAddCampus={() => { setEditingCampus(null); setIsCampusFormOpen(true); }}
                onEditDepartment={d => { setEditingDept(d); setIsDeptFormOpen(true); }}
                onEditCampus={c => { setEditingCampus(c); setIsCampusFormOpen(true); }}
                onSelectStudent={s => setStudentModalTarget(s)}
              />
            )}

            {currentRoute === 'how-it-works' && (
              <HowItWorksView />
            )}

            {currentRoute === 'profile' && (
              <ProfilePage
                onNavigateToTalent={() => navigateTo('talent')}
                onNavigateToLogin={() => navigateTo('login')}
              />
            )}
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Modals */}
      <StudentModal
        student={studentModalTarget}
        onClose={() => setStudentModalTarget(null)}
        onEditStudent={s => {
          setStudentModalTarget(null);
          setEditingStudent(s);
          setIsStudentFormOpen(true);
        }}
      />

      <MultiStepProfileModal
        isOpen={isStudentFormOpen}
        initialStudent={editingStudent}
        onClose={() => {
          setIsStudentFormOpen(false);
          setEditingStudent(null);
        }}
      />

      <ProjectFormModal
        isOpen={isProjectFormOpen}
        initialProject={editingProject}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
      />

      <DepartmentModal
        isOpen={isDeptFormOpen}
        initialDepartment={editingDept}
        onClose={() => {
          setIsDeptFormOpen(false);
          setEditingDept(null);
        }}
      />

      <CampusModal
        isOpen={isCampusFormOpen}
        initialCampus={editingCampus}
        onClose={() => {
          setIsCampusFormOpen(false);
          setEditingCampus(null);
        }}
      />

      <AdminControlModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenAddStudent={() => { setIsAdminOpen(false); setEditingStudent(null); setIsStudentFormOpen(true); }}
        onOpenAddProject={() => { setIsAdminOpen(false); setEditingProject(null); setIsProjectFormOpen(true); }}
        onOpenAddDepartment={() => { setIsAdminOpen(false); setEditingDept(null); setIsDeptFormOpen(true); }}
        onOpenAddCampus={() => { setIsAdminOpen(false); setEditingCampus(null); setIsCampusFormOpen(true); }}
      />
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
