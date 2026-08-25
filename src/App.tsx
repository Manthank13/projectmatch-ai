import React, { useState, useEffect, Suspense } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroInput } from './components/architect/HeroInput';
import { AnalysisSequence } from './components/architect/AnalysisSequence';
import { ArchitectDashboard } from './components/architect/ArchitectDashboard';
import { StudentModal } from './components/talent/StudentModal';
import { MultiStepProfileModal } from './components/modals/MultiStepProfileModal';
import { ProjectFormModal } from './components/modals/ProjectFormModal';
import { DepartmentModal } from './components/modals/DepartmentModal';
import { CampusModal } from './components/modals/CampusModal';
import { AdminControlModal } from './components/modals/AdminControlModal';

// Code-split heavy views for optimal loading performance
const TalentMatrixView = React.lazy(() => import('./components/talent/TalentMatrixView').then(m => ({ default: m.TalentMatrixView })));
const ProjectArchiveView = React.lazy(() => import('./components/projects/ProjectArchiveView').then(m => ({ default: m.ProjectArchiveView })));
const CampusCommandCenter = React.lazy(() => import('./components/campus/CampusCommandCenter').then(m => ({ default: m.CampusCommandCenter })));
const HowItWorksView = React.lazy(() => import('./components/howitworks/HowItWorksView').then(m => ({ default: m.HowItWorksView })));
const ProfilePage = React.lazy(() => import('./components/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Code-split Auth Pages
const LoginPage = React.lazy(() => import('./components/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignUpPage = React.lazy(() => import('./components/auth/SignUpPage').then(m => ({ default: m.SignUpPage })));
const ForgotPasswordPage = React.lazy(() => import('./components/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('./components/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = React.lazy(() => import('./components/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));

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

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 animate-fadeIn">
    <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
    <span className="text-xs font-headline font-bold text-on-surface-variant tracking-wider uppercase">
      Loading Grid Node...
    </span>
  </div>
);

const MainApp: React.FC = () => {
  const { students, projects, updateStudent, addStudent } = useData();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Route state initialized from pathname
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      const validRoutes: AppRoute[] = [
        'architect', 'talent', 'projects', 'campus', 'how-it-works', 'profile',
        'login', 'signup', 'forgot-password', 'reset-password', 'verify-email'
      ];
      if (validRoutes.includes(path as AppRoute)) {
        return path as AppRoute;
      }
    }
    return 'architect';
  });

  // Browser History pushState sync
  const navigateTo = (route: string) => {
    const validRoute = route as AppRoute;
    setCurrentRoute(validRoute);
    if (typeof window !== 'undefined') {
      const targetPath = validRoute === 'architect' ? '/' : `/${validRoute}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ route: validRoute }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playWhoosh();
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.route) {
        setCurrentRoute(e.state.route);
      } else {
        const path = window.location.pathname.replace(/^\//, '') || 'architect';
        setCurrentRoute(path as AppRoute);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);



  // Architect Pipeline State
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TeamArchitectResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal target state
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

  // Trigger Team Architect Pipeline
  const handleArchitect = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || prompt;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    playChime();

    try {
      const result = await recommendTeamAI(textToAnalyze, students, projects);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      playSuccess();
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'AI team synthesis failed. Please try again.');
    }
  };

  const handleArchitectProject = (proj: ProjectArchetype) => {
    setPrompt(proj.description);
    navigateTo('architect');
    handleArchitect(proj.description);
  };

  const isAuthRoute = [
    'login',
    'signup',
    'forgot-password',
    'reset-password',
    'verify-email'
  ].includes(currentRoute);

  // Protect the main ProjectMatch application from unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthRoute) {
      navigateTo('login');
    }
  }, [isLoading, isAuthenticated, isAuthRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <span className="text-xs font-headline font-bold text-on-surface-variant tracking-wider uppercase">
          Initializing Grid Session...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-cyan-500/25 selection:text-cyan-300">
      {/* Auth Pages (Clean fullscreen layouts) */}
      <Suspense fallback={<RouteLoadingFallback />}>
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
      </Suspense>

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
            <Suspense fallback={<RouteLoadingFallback />}>
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
            </Suspense>
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
