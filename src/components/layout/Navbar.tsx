import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ThemeMode } from '../../types';

interface NavbarProps {
  activeTab: 'architect' | 'talent' | 'projects' | 'campus' | 'how-it-works';
  setActiveTab: (tab: 'architect' | 'talent' | 'projects' | 'campus' | 'how-it-works') => void;
  onOpenAddStudent: () => void;
  onOpenAddProject: () => void;
  onOpenAddDepartment: () => void;
  onOpenAddCampus: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenAddProject,
  onOpenAddDepartment,
  onOpenAddCampus,
  onOpenAdmin
}) => {
  const { theme, setTheme } = useData();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const navItems = [
    { id: 'architect', label: 'ARCHITECT', icon: 'psychology' },
    { id: 'talent', label: 'TALENT', icon: 'groups' },
    { id: 'projects', label: 'PROJECTS', icon: 'rocket_launch' },
    { id: 'campus', label: 'CAMPUS', icon: 'hub' },
    { id: 'how-it-works', label: 'HOW IT WORKS', icon: 'auto_awesome' },
  ] as const;

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-5 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="glass-capsule rounded-full px-5 sm:px-7 py-3 flex justify-between items-center w-full">
        {/* Brand: Connected Abstract Node Logo */}
        <div 
          onClick={() => setActiveTab('architect')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-cyan-400/30 border border-cyan-400/30 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-cyan-400 text-xl font-bold animate-pulse">
              grain
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold font-headline text-on-surface tracking-tight group-hover:text-cyan-400 transition-colors">
                PROJECTMATCH
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold font-headline tracking-widest uppercase">
                AI OS
              </span>
            </div>
            <span className="text-[10px] font-headline text-on-surface-variant font-medium tracking-wider uppercase -mt-0.5">
              AI Team Architect
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation: Minimalist Glass Pills with Active Glow */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-surface-container-low/40 border border-outline-variant/30 font-headline text-xs font-bold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-cyan-glow font-extrabold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-cyan-glow animate-pulse" />
                )}
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* + CREATE Glass Command Button */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-cyan-500/10 border border-outline-variant hover:border-cyan-400/50 text-on-surface hover:text-cyan-300 font-headline text-xs font-bold transition-all shadow-sm hover:shadow-cyan-glow"
            >
              <span className="material-symbols-outlined text-cyan-400 text-sm font-bold">add</span>
              <span>CREATE</span>
            </button>

            {showCreateMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCreateMenu(false)}
                />
                <div className="absolute right-0 mt-3 w-60 glass-dropdown rounded-3xl p-2.5 z-50 animate-fadeIn font-headline text-xs font-bold">
                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddStudent(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-cyan-500/10 text-on-surface text-left transition-colors group"
                  >
                    <span className="material-symbols-outlined text-cyan-400 text-xl group-hover:scale-110 transition-transform">
                      person_add
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-cyan-300">+ Talent Profile</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">7-step profile builder</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddProject(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-500/10 text-on-surface text-left transition-colors group"
                  >
                    <span className="material-symbols-outlined text-violet-400 text-xl group-hover:scale-110 transition-transform">
                      rocket_launch
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-violet-300">+ Project Brief</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Index project requirements</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddDepartment(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-mint-500/10 text-on-surface text-left transition-colors group"
                  >
                    <span className="material-symbols-outlined text-mint-accent text-xl group-hover:scale-110 transition-transform">
                      domain
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-mint-accent">+ Department</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Register academic lab</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddCampus(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.06] text-on-surface text-left transition-colors group"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-xl group-hover:scale-110 transition-transform">
                      apartment
                    </span>
                    <div>
                      <span className="block text-on-surface">+ Campus Location</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Register facility hub</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-outline-variant text-on-surface-variant hover:text-cyan-400 transition-colors"
            title={`Current theme: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === 'dark' ? (
              <span className="material-symbols-outlined text-cyan-400 text-sm">dark_mode</span>
            ) : theme === 'light' ? (
              <span className="material-symbols-outlined text-amber-400 text-sm">light_mode</span>
            ) : (
              <span className="material-symbols-outlined text-violet-400 text-sm">settings_brightness</span>
            )}
          </button>

          {/* Profile Button with Glass Halo */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-400/40 hover:border-cyan-400 hover:scale-105 transition-all shadow-cyan-glow flex-shrink-0"
              title="Talent Network Menu"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8pvIXteauq5mUsiXl24rVdfe1VtldA80FOcjvVsQZrVq-paEYSz9t8vVgTCRp15sJgUj1RNJWZNN8wQVokJ9FtSVKnqykR8AKo3Ivk37cr_XWDYYTZLs1yifkxU0NfnSjFkAL_q5ssMyWWffmOFiT0hBSj8gI7WzYGf6kfkqiNg_2jKguGyc5dw1U_h6VnTBoki9A6RAlZGNIr64UhClkrgL3geIOLNkX9E8GPHiMItNnKa0QmHbM"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-3 w-52 glass-dropdown rounded-3xl p-2 z-50 animate-fadeIn font-headline text-xs font-bold">
                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenAddStudent(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/[0.06] text-on-surface text-left"
                  >
                    <span className="material-symbols-outlined text-cyan-400 text-base">badge</span>
                    <span>View / Edit Profile</span>
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenAdmin(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/[0.06] text-on-surface text-left"
                  >
                    <span className="material-symbols-outlined text-violet-400 text-base">monitoring</span>
                    <span>Admin & Telemetry</span>
                  </button>

                  <div className="my-1 border-t border-outline-variant/30" />

                  <button
                    onClick={() => { setShowProfileMenu(false); cycleTheme(); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/[0.06] text-on-surface text-left"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-base">palette</span>
                    <span>Theme: {theme.toUpperCase()}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-white/[0.06]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileNav && (
        <div className="lg:hidden mt-2 glass-card rounded-3xl p-4 space-y-1 font-headline text-xs font-bold animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileNav(false);
              }}
              className={`w-full text-left p-3 rounded-2xl flex items-center gap-2.5 ${
                activeTab === item.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                  : 'text-on-surface hover:bg-white/[0.04]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
