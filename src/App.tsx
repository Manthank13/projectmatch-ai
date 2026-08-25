import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroInput } from './components/architect/HeroInput';
import { AnalysisSequence } from './components/architect/AnalysisSequence';
import { ArchitectDashboard } from './components/architect/ArchitectDashboard';
import { TalentMatrixView } from './components/talent/TalentMatrixView';
import { ProjectArchiveView } from './components/projects/ProjectArchiveView';
import { CampusCommandCenter } from './components/campus/CampusCommandCenter';
import { HowItWorksView } from './components/howitworks/HowItWorksView';
import { StudentModal } from './components/talent/StudentModal';
import { MultiStepProfileModal } from './components/modals/MultiStepProfileModal';
import { ProjectFormModal } from './components/modals/ProjectFormModal';
import { DepartmentModal } from './components/modals/DepartmentModal';
import { CampusModal } from './components/modals/CampusModal';
import { AdminControlModal } from './components/modals/AdminControlModal';
import { recommendTeamAI } from './services/aiService';
import { Student, ProjectArchetype, Department, Campus, TeamArchitectResult } from './types';
import { playChime, playSuccess, playWhoosh } from './utils/sound';

const MainApp: React.FC = () => {
  const { students, projects } = useData();

  const [activeTab, setActiveTab] = useState<'architect' | 'talent' | 'projects' | 'campus' | 'how-it-works'>('architect');
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
    setActiveTab('architect');

    window.scrollTo({ top: 0, behavior: 'smooth' });

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background transition-colors duration-300 font-body relative">
      {/* Ambient background mesh */}
      <div className="ambient-network-bg" />

      {/* Floating Glass Capsule Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddStudent={() => { setEditingStudent(null); setIsStudentFormOpen(true); }}
        onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
        onOpenAddDepartment={() => { setEditingDept(null); setIsDeptFormOpen(true); }}
        onOpenAddCampus={() => { setEditingCampus(null); setIsCampusFormOpen(true); }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-16 relative z-10">
        {activeTab === 'architect' && (
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
                onExploreTalent={() => setActiveTab('talent')}
                isAnalyzing={isAnalyzing}
              />
            )}
          </>
        )}

        {activeTab === 'talent' && (
          <TalentMatrixView
            onOpenAddStudent={() => { setEditingStudent(null); setIsStudentFormOpen(true); }}
            onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
            onEditStudent={s => { setEditingStudent(s); setIsStudentFormOpen(true); }}
            onNavigateToArchitect={() => setActiveTab('architect')}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectArchiveView
            onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
            onEditProject={p => { setEditingProject(p); setIsProjectFormOpen(true); }}
            onArchitectProject={handleArchitectProject}
          />
        )}

        {activeTab === 'campus' && (
          <CampusCommandCenter
            onOpenAddDepartment={() => { setEditingDept(null); setIsDeptFormOpen(true); }}
            onOpenAddCampus={() => { setEditingCampus(null); setIsCampusFormOpen(true); }}
            onEditDepartment={d => { setEditingDept(d); setIsDeptFormOpen(true); }}
            onEditCampus={c => { setEditingCampus(c); setIsCampusFormOpen(true); }}
            onSelectStudent={s => setStudentModalTarget(s)}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView />
        )}
      </main>

      {/* Modals */}
      <StudentModal
        student={studentModalTarget}
        onClose={() => setStudentModalTarget(null)}
        onEditStudent={s => {
          setEditingStudent(s);
          setIsStudentFormOpen(true);
        }}
      />

      <MultiStepProfileModal
        isOpen={isStudentFormOpen}
        onClose={() => { setIsStudentFormOpen(false); setEditingStudent(null); }}
        initialStudent={editingStudent}
      />

      <ProjectFormModal
        isOpen={isProjectFormOpen}
        onClose={() => { setIsProjectFormOpen(false); setEditingProject(null); }}
        initialProject={editingProject}
      />

      <DepartmentModal
        isOpen={isDeptFormOpen}
        onClose={() => { setIsDeptFormOpen(false); setEditingDept(null); }}
        initialDepartment={editingDept}
      />

      <CampusModal
        isOpen={isCampusFormOpen}
        onClose={() => { setIsCampusFormOpen(false); setEditingCampus(null); }}
        initialCampus={editingCampus}
      />

      <AdminControlModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenAddStudent={() => { setEditingStudent(null); setIsStudentFormOpen(true); }}
        onOpenAddProject={() => { setEditingProject(null); setIsProjectFormOpen(true); }}
        onOpenAddDepartment={() => { setEditingDept(null); setIsDeptFormOpen(true); }}
        onOpenAddCampus={() => { setEditingCampus(null); setIsCampusFormOpen(true); }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
