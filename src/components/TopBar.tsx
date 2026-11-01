import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import {
  Menu,
  PlusCircle,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  Landmark,
} from 'lucide-react';

interface TopBarProps {
  activeTab: ActiveTab;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNavigateTab,
  theme,
  onThemeToggle,
}) => {
  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'report':
        return 'Report an Issue';
      case 'issues':
        return 'Issue Registry';
      case 'tracking':
        return 'Complaint Tracking';
      case 'reports':
        return 'Reports & Audits';
      case 'settings':
        return 'System & Settings';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
      {/* Zone 1: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0">
          <span className="font-semibold text-slate-400 hidden sm:inline">CivicDesk</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {getTabLabel(activeTab)}
          </span>
        </div>
      </div>

      {/* Zone 2 & 3: Quick Action & Theme Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick search shortcut */}
        <button
          type="button"
          onClick={() => onNavigateTab('tracking')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Track Complaint ID</span>
        </button>

        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={onThemeToggle}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Primary Action Button */}
        {activeTab !== 'report' && (
          <button
            type="button"
            onClick={() => onNavigateTab('report')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </button>
        )}
      </div>
    </header>
  );
};
