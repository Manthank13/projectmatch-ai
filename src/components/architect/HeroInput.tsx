import React from 'react';
import { useData } from '../../context/DataContext';

interface HeroInputProps {
  prompt: string;
  setPrompt: (text: string) => void;
  onArchitect: (customPrompt?: string) => void;
  onExploreTalent: () => void;
  isAnalyzing: boolean;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  prompt,
  setPrompt,
  onArchitect,
  onExploreTalent,
  isAnalyzing
}) => {
  const { projects } = useData();

  const handlePresetClick = (presetTitle: string, presetDesc: string) => {
    setPrompt(presetDesc);
  };

  const handleFindMyTeamClick = () => {
    const inputEl = document.getElementById('projectInputArea');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth' });
      inputEl.focus();
    }
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn">
      {/* Friendly Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden bento-card p-8 md:p-14 flex flex-col md:flex-row items-center gap-12 min-h-[540px]">
        {/* Soft Background Radial Bloom */}
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-tr from-secondary-container/20 via-primary-container/10 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/25 text-on-secondary-container text-xs font-headline font-bold">
            <span className="material-symbols-outlined text-sm">stars</span>
            ✦ SRM INNOVATION GRID (Synthetic Demo University Network)
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface leading-[1.15] tracking-tight">
            <span>FIND YOUR PEOPLE.</span>{' '}
            <span className="text-primary block mt-1">BUILD SOMETHING GREAT.</span>
          </h1>

          <p className="text-base sm:text-lg font-body text-on-surface-variant max-w-lg leading-relaxed">
            ProjectMatch uses AI to find complementary teammates across your university. Stop stressing about group work. Start building.
          </p>

          <div className="flex flex-wrap gap-4 mt-2 font-headline">
            <button
              onClick={handleFindMyTeamClick}
              className="px-8 py-4 bg-primary-container text-on-primary-container rounded-full text-sm font-bold shadow-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>FIND MY TEAM</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <button
              onClick={onExploreTalent}
              className="px-8 py-4 bg-surface dark:bg-surface-container text-on-surface rounded-full text-sm font-bold border border-outline-variant hover:bg-surface-variant transition-all shadow-sm hover:scale-105"
            >
              EXPLORE TALENT
            </button>
          </div>
        </div>

        {/* Playful Floating Student Characters Visual */}
        <div className="relative z-10 flex-1 w-full h-full min-h-[360px] flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-full bg-gradient-to-tr from-secondary-container/20 to-primary-container/20 backdrop-blur-3xl shadow-glow flex items-center justify-center">
            {/* Avatar 1: Tony Stark (AI / Tech) */}
            <div className="absolute top-2 left-1/4 w-16 h-16 rounded-full overflow-hidden border-4 border-surface shadow-soft animate-float z-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4RzXU2GB04GCYx9u-TAoQ9_9GsyWxjre7V_Ertq0_p93iiSYG-iozkIkbstlXtOj5ZYh5A4Yp1Zz9wWMwQWY-TN-Xz7cAmNQn9id5bRxq-DSApX3vpHAgq9FTzKifpPLdMyV0gfCPoR3CsTo4_bJJV7D_dihVsDTRPtaxRdmhu8614Cmf9jTuw9eVK8f6H9ziOdRZ4bJ3ZNDENmlebsWz7xI35GPkGdoRt-9-H_MwBu2EG01fTwpT"
                alt="Tony Stark"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar 2: Shuri (Research / BioTech) */}
            <div className="absolute bottom-6 left-6 w-18 h-18 rounded-full overflow-hidden border-4 border-surface shadow-soft animate-float-delayed z-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyfXTIBvf2-HDDh7lWifR42qsLcGBD2Q5PEMnXBbdp2MU7VfKZ4Nygx5Y7WrmmfWZBZSV3vzTsJ8uKuN1u3_hAk9czScfULGlASGlxdG_LSVbOHjsbOYeCBHNkEGSj7x8Ii2Kk5Dtkt4nK5yoV9Z7yxYKRxAGT86nc1zyUxJRarMggSCwXQJhREOG3jIf29wSKbu2vFyabR0X0ElzYrVfU6rh4Fe09lce3oFHSZQLLYPDVoQMdPCWz"
                alt="Shuri"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar 3: Peter Parker (Vision / Data) */}
            <div className="absolute top-1/3 -right-2 w-14 h-14 rounded-full overflow-hidden border-4 border-surface shadow-soft animate-float z-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIAEM0CmncmJFyu0d0iJUC33DhPTtnS5wovf_yHctEWhWzTKMTMSGIiDoCPIpcEMYVk7V0zm1z9ytOnFN8ZoILMfK-zIydqW8A8iqRoeUEyryUh-KA2Rhpb_AqBAVnyQ5iYuiFixWXTYk5F4efglYeDPoqoca_u19ylN9SjTu85YkMK-CCYKFpNZRr7bPgmtK2-pnimLtloPIIL3Ghdv51Q72cELzSoH7g3B8l6lu7idI602KENScV"
                alt="Peter Parker"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar 4: Barbie (UX / Design) */}
            <div className="absolute bottom-1/4 right-6 w-16 h-16 rounded-full overflow-hidden border-4 border-surface shadow-soft animate-float-delayed z-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-WIpwt9af-h2O_waK-V2JWa4mE0FdIstBdzyr5a2V_oJ9O3cHvMeC5pa9WZJK2XzWMELvohzB256nMabl2362_0-zIbpK_6wzzAFLUH34AYq3TeELZ3CfbdRSlWsnnP3GdEomH5Mf7rVW4Qrf0-yisweD-rRfYmSWGSSTwNgK8029CVcKL9Yy-w-v7z6MZi-Gt7TI_JUCuN3a-rRmVykQjlLm50yOBnUYs7HMMvXzB7ZomOM5YYI_"
                alt="Barbie"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Project Rocket */}
            <div className="w-28 h-28 rounded-3xl bg-surface shadow-soft flex items-center justify-center transform rotate-3 animate-float z-10 border border-outline-variant">
              <span className="material-symbols-outlined text-5xl text-primary font-bold">rocket_launch</span>
            </div>

            {/* Floating Skill Chips */}
            <div className="absolute -top-2 right-8 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-bold font-headline animate-float-delayed shadow-sm">
              ✨ AI
            </div>
            <div className="absolute -bottom-2 left-1/3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold font-headline animate-float shadow-sm">
              🎨 Design
            </div>
            <div className="absolute top-1/2 -left-6 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold font-headline animate-float-delayed shadow-sm">
              📊 Data
            </div>
            <div className="absolute bottom-1/3 -right-4 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold font-headline animate-float shadow-sm">
              🌿 Environment
            </div>
          </div>
        </div>
      </section>

      {/* Architect Project Input Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Project Input Card */}
        <div className="md:col-span-7 bento-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-on-surface">
              WHAT ARE YOU BUILDING?
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <textarea
              id="projectInputArea"
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Tell us about your project... e.g. We're building an AI platform that detects ocean pollution using satellite and environmental data."
              className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/60 focus:ring-2 focus:ring-primary-container resize-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/60 leading-relaxed"
            />

            <button
              onClick={() => onArchitect(prompt)}
              disabled={isAnalyzing || !prompt.trim()}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black rounded-2xl font-headline text-sm font-extrabold shadow-cyan-glow transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>✦ ARCHITECT MY TEAM</span>
            </button>
          </div>

          {/* Quick Demo Presets */}
          <div className="pt-4 border-t border-outline-variant/30">
            <p className="text-xs font-headline font-bold text-on-surface-variant mb-2">
              OR TRY A DEMO PROJECT:
            </p>
            <div className="flex flex-wrap gap-2">
              {projects.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetClick(p.title, p.description)}
                  className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-primary-fixed hover:text-on-primary-fixed border border-outline-variant/60 text-xs font-headline font-bold text-on-surface transition-all flex items-center gap-1.5"
                >
                  <span>{p.icon}</span>
                  <span>{p.slug === 'interstellar' ? 'Ocean Intelligence' : p.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition Info Card */}
        <div className="md:col-span-5 bento-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-surface to-surface-container flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-headline text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>CORE PRODUCT PRINCIPLE</span>
            </div>

            <h3 className="text-xl font-headline font-extrabold text-on-surface">
              INDIVIDUAL FIT ≠ TEAM VALUE
            </h3>

            <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed">
              Standard matching tools only rank individual test scores, which often results in 4 identical ML engineers with 0% domain knowledge or product usability.
            </p>

            <div className="p-4 rounded-2xl bg-surface-container-highest/50 border border-outline-variant/40 text-xs font-body space-y-2">
              <div className="flex items-center gap-2 text-on-surface font-bold">
                <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                <span>Combinatorial Submodular Synergy</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">
                ProjectMatch calculates the marginal capability delta each candidate brings to eliminate single points of failure.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/30 text-[11px] font-headline text-on-surface-variant flex items-center justify-between">
            <span>● 25+ Talents Live Indexed</span>
            <span className="text-primary font-bold">SRM GRID v3.0</span>
          </div>
        </div>
      </section>
    </div>
  );
};
