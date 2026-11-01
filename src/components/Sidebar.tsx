import React from 'react';
import { ActiveTab, UserProfile, ThemeMode } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Search,
  BarChart3,
  Settings,
  Shield,
  Sun,
  Moon,
  Laptop,
  HardDrive,
  Landmark,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingCount: number;
  totalCount: number;
  userProfile: UserProfile;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  totalCount,
  userProfile,
  theme,
  onThemeChange,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'report' as ActiveTab,
      label: 'Report Issue',
      icon: PlusCircle,
      badge: null,
    },
    {
      id: 'issues' as ActiveTab,
      label: 'Issue Registry',
      icon: FolderKanban,
      badge: pendingCount > 0 ? `${pendingCount} pending` : null,
    },
    {
      id: 'tracking' as ActiveTab,
      label: 'Track Complaint',
      icon: Search,
      badge: null,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Reports & Audits',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings & Data',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden no-print"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 no-print ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  CivicDesk
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Local Issue System
                </span>
              </div>
            </div>
          </div>

          {/* Ward Context Badge */}
          <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-slate-800/50 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">
              Assigned Ward
            </span>
            <span className="text-slate-200 font-semibold truncate block mt-0.5">
              {userProfile.neighborhoodName || 'Community District'}
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Local Storage Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Storage</span>
            </div>
            <span className="font-mono text-slate-300 tabular-nums">
              {totalCount} item{totalCount === 1 ? '' : 's'}
            </span>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center justify-between p-1 rounded-lg bg-slate-800/80 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-colors ${
                theme === 'light' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-colors ${
                theme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('system')}
              className={`flex-1 py-1 flex items-center justify-center rounded-md transition-colors ${
                theme === 'system' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="System Mode"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
