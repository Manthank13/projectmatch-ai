import React from 'react';

export const HowItWorksView: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Project Ingestion & Semantic Deconstruction',
      icon: 'psychology',
      desc: 'Extracts core functional milestones, mandatory technical proficiencies, specialized domain requirements, and minimum scheduling commitments from your natural language project concept.'
    },
    {
      step: '02',
      title: 'Talent Pool Candidate Filtering',
      icon: 'filter_alt',
      desc: 'Applies hard constraints (availability overlap >= min required, active student status) to eliminate scheduling failure modes early before combinatorial analysis.'
    },
    {
      step: '03',
      title: 'Submodular Capability Gap Minimization',
      icon: 'calculate',
      desc: 'Instead of greedily picking the 4 highest individual test scorers (which creates redundancy), the engine evaluates candidates by marginal team value added to the collective capability matrix.'
    },
    {
      step: '04',
      title: 'Hidden Team Value Identification',
      icon: 'diamond',
      desc: 'Pinpoints domain specialists who might score lower on isolated software exams but single-handedly resolve fatal missing capabilities (e.g. Environmental / Marine Science).'
    },
    {
      step: '05',
      title: 'Near-Miss & Risk Auditing',
      icon: 'warning_amber',
      desc: 'Flags high-competency candidates who were bypassed strictly due to boundary constraints (e.g. 7h committed vs 8h required), preventing opaque algorithmic decisions.'
    },
    {
      step: '06',
      title: 'Squad Topology & DNA Synthesis',
      icon: 'insights',
      desc: 'Constructs a multi-dimensional capability balance across Machine Learning, Backend, Domain, UX, Availability, and Execution Velocity to guarantee balanced team dynamics.'
    }
  ];

  return (
    <div className="space-y-12 py-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold inline-block">
          ✦ ALGORITHMIC ARCHITECTURE
        </span>
        <h1 className="text-3xl sm:text-5xl font-headline font-extrabold text-primary">
          HOW PROJECTMATCH ARCHITECTS TEAMS
        </h1>
        <p className="text-base font-body text-on-surface-variant leading-relaxed">
          Traditional matching tools optimize for isolated individuals. ProjectMatch mathematically constructs synergistic squads.
        </p>
      </div>

      {/* Core Equation / Theorem Banner */}
      <div className="bento-card rounded-3xl p-8 bg-gradient-to-r from-primary-fixed/20 via-surface to-secondary-fixed/20 border-primary-fixed-dim">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-headline font-bold text-primary uppercase">
              THE CORE MATHEMATICAL PRINCIPLE
            </span>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">
              Marginal Value Over Greedy Maximization
            </h3>
            <p className="text-xs font-body text-on-surface-variant max-w-xl leading-relaxed">
              If Team S already covers Machine Learning, adding a second ML specialist provides diminishing marginal return f(S ∪ u) - f(S) ≈ 0. Adding an Environmental domain scientist v provides massive marginal return f(S ∪ v) - f(S) ≫ 0.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-outline-variant text-center font-headline text-sm font-bold shadow-sm whitespace-nowrap">
            <span className="text-primary block text-lg">Individual Fit ≠ Team Value</span>
            <span className="text-[11px] text-on-surface-variant font-normal">Submodular Optimization</span>
          </div>
        </div>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map(step => (
          <div key={step.step} className="bento-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary font-headline font-extrabold text-sm border border-outline-variant/40">
                  {step.step}
                </span>
                <span className="material-symbols-outlined text-2xl text-secondary">
                  {step.icon}
                </span>
              </div>

              <h4 className="text-lg font-headline font-extrabold text-on-surface leading-snug">
                {step.title}
              </h4>

              <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 text-[11px] font-headline text-primary font-bold">
              ✓ Automated AI Step
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
