import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: 'architect' | 'talent' | 'projects' | 'campus' | 'how-it-works' | 'profile';
  setActiveTab: (tab: 'architect' | 'talent' | 'projects' | 'campus' | 'how-it-works' | 'profile') => void;
  onOpenAddStudent: () => void;
  onOpenAddProject: () => void;
  onOpenAddDepartment: () => void;
  onOpenAddCampus: () => void;
  onOpenAdmin: () => void;
  onNavigateAuth?: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenAddProject,
  onOpenAddDepartment,
  onOpenAddCampus,
  onOpenAdmin,
  onNavigateAuth
}) => {
  const { theme, setTheme } = useData();
  const { user, isAuthenticated, logout } = useAuth();

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

  const userAvatar = user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <header className="sticky top-5 z-40 app-page-container transition-all duration-300">
      <div className="glass-capsule rounded-full px-5 sm:px-7 py-3 flex justify-between items-center w-full">
        {/* Brand: Connected Abstract Node Logo */}
        <div 
          onClick={() => setActiveTab('architect')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-cyan-400/30 border border-cyan-400/30 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-xl font-bold animate-pulse">
              grain
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold font-headline text-on-surface tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                PROJECTMATCH
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold font-headline tracking-widest uppercase">
                AI OS
              </span>
            </div>
            <span className="text-[10px] font-headline text-on-surface-variant font-medium tracking-wider uppercase -mt-0.5">
              AI Team Architect
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation: Minimalist Glass Pills with Active Glow */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-surface-container-low/40 border border-outline-variant font-headline text-xs font-bold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/20 dark:from-cyan-500/25 dark:to-violet-500/25 border border-sky-500/50 dark:border-cyan-400/50 text-slate-900 dark:text-cyan-300 shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/[0.06]'
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
        <div className="flex items-center gap-2.5">
          {/* + CREATE Glass Command Button */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-surface-elevated hover:bg-cyan-500/10 border border-outline-variant hover:border-cyan-400/50 text-on-surface hover:text-cyan-600 dark:hover:text-cyan-300 font-headline text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-sm font-bold">add</span>
              <span className="hidden sm:inline">CREATE</span>
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
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-cyan-500/10 text-on-surface text-left transition-colors group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-xl group-hover:scale-110 transition-transform">
                      person_add
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-cyan-600 dark:group-hover:text-cyan-300">+ Talent Profile</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Add yourself to matrix</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddProject(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-500/10 text-on-surface text-left transition-colors group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-xl group-hover:scale-110 transition-transform">
                      rocket_launch
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-violet-600 dark:group-hover:text-violet-300">+ Project Brief</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Index project requirements</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddDepartment(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-emerald-500/10 text-on-surface text-left transition-colors group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-emerald-600 dark:text-mint-accent text-xl group-hover:scale-110 transition-transform">
                      domain
                    </span>
                    <div>
                      <span className="block text-on-surface group-hover:text-emerald-600 dark:group-hover:text-mint-accent">+ Department</span>
                      <span className="block text-[10px] font-normal text-on-surface-variant">Register academic lab</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowCreateMenu(false); onOpenAddCampus(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-500/10 text-on-surface text-left transition-colors group cursor-pointer"
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
            className="p-2 rounded-full bg-surface-elevated hover:bg-slate-900/5 dark:hover:bg-white/[0.08] border border-outline-variant text-on-surface-variant hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            title={`Current theme: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === 'dark' ? (
              <span className="material-symbols-outlined text-cyan-400 text-sm">dark_mode</span>
            ) : theme === 'light' ? (
              <span className="material-symbols-outlined text-amber-500 text-sm">light_mode</span>
            ) : (
              <span className="material-symbols-outlined text-violet-400 text-sm">settings_brightness</span>
            )}
          </button>

          {/* Authentication & Profile Menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-400/60 hover:border-cyan-400 hover:scale-105 transition-all shadow-cyan-glow flex-shrink-0 cursor-pointer bg-surface"
                title={`${user.fullName} (${user.email})`}
              >
                <img
                  src={userAvatar}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-mint-accent border border-surface" />
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 glass-dropdown rounded-3xl p-2.5 z-50 animate-fadeIn font-headline text-xs font-bold shadow-2xl">
                    <div className="px-3 py-2.5 border-b border-outline-variant mb-1">
                      <span className="block text-on-surface font-extrabold truncate">{user.fullName}</span>
                      <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 font-bold truncate">{user.role || 'Student Technologist'}</span>
                      <span className="block text-[10px] text-on-surface-variant font-normal truncate mt-0.5">{user.email}</span>
                    </div>

                    <button
                      onClick={() => { setShowProfileMenu(false); onNavigateAuth?.('profile'); }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-cyan-500/10 text-on-surface text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-base">person</span>
                      <span>Edit My Profile</span>
                    </button>

                    <button
                      onClick={() => { setShowProfileMenu(false); onOpenAdmin(); }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-violet-500/10 text-on-surface text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-base">monitoring</span>
                      <span>Admin & Telemetry</span>
                    </button>

                    <div className="my-1 border-t border-outline-variant" />

                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-error-container text-error text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigateAuth?.('login')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-space-black font-headline text-xs font-extrabold shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>SIGN IN</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-slate-900/5 dark:hover:bg-white/[0.06] cursor-pointer"
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
                  ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/20 dark:from-cyan-500/25 dark:to-violet-500/25 text-slate-900 dark:text-cyan-300 border border-sky-500/50 dark:border-cyan-400/30'
                  : 'text-on-surface hover:bg-slate-900/5 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setShowMobileNav(false);
                onNavigateAuth?.('profile');
              }}
              className="w-full text-left p-3 rounded-2xl flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 font-extrabold border-t border-outline-variant mt-2"
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>My Profile ({user?.fullName})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowMobileNav(false);
                onNavigateAuth?.('login');
              }}
              className="w-full text-left p-3 rounded-2xl flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 font-extrabold border-t border-outline-variant mt-2"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In to ProjectMatch</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
