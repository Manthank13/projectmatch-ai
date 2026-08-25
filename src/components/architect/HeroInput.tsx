import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TalentMatrixVisual } from './TalentMatrixVisual';

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
  const [triggerVisualScan, setTriggerVisualScan] = useState(false);

  const handlePresetClick = (presetTitle: string, presetDesc: string) => {
    setPrompt(presetDesc);
  };

  const handleFindMyTeamClick = () => {
    setTriggerVisualScan(true);
    setTimeout(() => setTriggerVisualScan(false), 2000);

    const inputEl = document.getElementById('projectInputArea');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth' });
      inputEl.focus();
    }
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn w-full max-w-full min-w-0">
      {/* Cyberpunk Hero Section with Interactive Talent Matrix */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-identity-card p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[540px] border border-cyan-500/20 shadow-2xl">
        {/* Soft Ambient Radial Bloom */}
        <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent pointer-events-none" />

        {/* Left Column: Hero Content & Call to Actions */}
        <div className="relative z-10 lg:col-span-6 flex flex-col items-start gap-5 min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-headline font-bold shadow-cyan-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>SRM INNOVATION GRID • AI TALENT OS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface leading-[1.12] tracking-tight">
            <span>FIND YOUR PEOPLE.</span>{' '}
            <span className="gradient-cyan-violet block mt-1">BUILD SOMETHING GREAT.</span>
          </h1>

          <p className="text-sm sm:text-base font-body text-on-surface-variant max-w-lg leading-relaxed">
            ProjectMatch uses submodular AI intelligence to discover complementary teammates across your university for hackathons, research labs, and startups.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mt-2 font-headline">
            <button
              onClick={handleFindMyTeamClick}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs sm:text-sm font-extrabold rounded-full shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>FIND MY TEAM</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <button
              onClick={onExploreTalent}
              className="px-8 py-4 glass-input hover:bg-slate-900/5 dark:hover:bg-white/[0.08] text-on-surface rounded-full text-xs sm:text-sm font-headline font-bold border border-outline-variant transition-all shadow-sm hover:scale-105 cursor-pointer"
            >
              EXPLORE TALENT
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-outline-variant/50 flex items-center gap-6 text-xs font-headline text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-mint-accent animate-pulse" />
              <strong>16</strong> Live Talents
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <strong>46+</strong> Skills Indexed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <strong>94%</strong> Synergy Fit
            </span>
          </div>
        </div>

        {/* Right Column: "THE TALENT MATRIX" Cyberpunk Interactive Visualization (~45% width) */}
        <div className="relative z-10 lg:col-span-6 w-full flex items-center justify-center min-w-0">
          <TalentMatrixVisual
            onTriggerArchitect={handleFindMyTeamClick}
            isTriggeredFromHero={triggerVisualScan}
          />
        </div>
      </section>

      {/* Architect Project Input Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Project Input Card */}
        <div className="md:col-span-7 glass-identity-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-2xl font-bold">psychology</span>
            <h2 className="text-xl sm:text-2xl font-headline font-extrabold text-on-surface">
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
              className="w-full p-4 rounded-2xl glass-input border border-outline-variant focus:ring-2 focus:ring-cyan-400 resize-none font-body text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 leading-relaxed"
            />

            <button
              onClick={() => onArchitect(prompt)}
              disabled={isAnalyzing || !prompt.trim()}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black rounded-2xl font-headline text-sm font-extrabold shadow-cyan-glow transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg font-bold">auto_awesome</span>
              <span>✦ ARCHITECT MY TEAM</span>
            </button>
          </div>

          {/* Quick Demo Presets */}
          <div className="pt-4 border-t border-outline-variant/40">
            <p className="text-xs font-headline font-bold text-on-surface-variant mb-2">
              OR TRY A DEMO PROJECT:
            </p>
            <div className="flex flex-wrap gap-2">
              {projects.slice(0, 5).map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetClick(p.title, p.description)}
                  className="px-3.5 py-1.5 rounded-full glass-input hover:bg-cyan-500/10 hover:border-cyan-400/40 border border-outline-variant text-xs font-headline font-bold text-on-surface transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{p.icon}</span>
                  <span>{p.slug === 'interstellar' ? 'Ocean Intelligence' : p.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition Info Card */}
        <div className="md:col-span-5 glass-identity-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6 border border-outline-variant shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-headline text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>CORE PRODUCT PRINCIPLE</span>
            </div>

            <h3 className="text-xl font-headline font-extrabold text-on-surface">
              INDIVIDUAL FIT ≠ TEAM VALUE
            </h3>

            <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed">
              Standard matching tools only rank individual test scores, which often results in 4 identical ML engineers with 0% domain knowledge or product usability.
            </p>

            <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant text-xs font-body space-y-2">
              <div className="flex items-center gap-2 text-on-surface font-bold">
                <span className="material-symbols-outlined text-emerald-600 dark:text-mint-accent text-sm">check_circle</span>
                <span>Combinatorial Submodular Synergy</span>
              </div>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                ProjectMatch calculates the marginal capability delta each candidate brings to eliminate single points of failure.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant text-[11px] font-headline text-on-surface-variant flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>16 Talents Indexed</span>
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">SRM GRID v3.0</span>
          </div>
        </div>
      </section>
    </div>
  );
};
