import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  CivicIssue,
  IssueStatus,
  ThemeMode,
  UserProfile,
} from './types';
import {
  loadIssuesFromStorage,
  saveIssuesToStorage,
  loadProfileFromStorage,
  saveProfileToStorage,
  STORAGE_KEYS,
  INITIAL_DEMO_ISSUES,
} from './utils/storage';
import { ToastProvider, useToast } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ReportIssueForm } from './components/ReportIssueForm';
import { IssueManagementPage } from './components/IssueManagementPage';
import { ComplaintTrackingPage } from './components/ComplaintTrackingPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { IssueDetailModal } from './components/IssueDetailModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Shield } from 'lucide-react';

function CivicDeskApp() {
  const { showToast } = useToast();

  // App State
  const [issues, setIssues] = useState<CivicIssue[]>(() => loadIssuesFromStorage());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadProfileFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals & Navigation Sub-state
  const [activeIssueModal, setActiveIssueModal] = useState<CivicIssue | null>(null);
  const [editingIssue, setEditingIssue] = useState<CivicIssue | null>(null);
  const [trackedComplaintId, setTrackedComplaintId] = useState<string>('');

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Theme Management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {}
    return 'system';
  });

  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Persist issues on change
  const updateIssuesState = (newIssues: CivicIssue[]) => {
    setIssues(newIssues);
    saveIssuesToStorage(newIssues);
  };

  // Persist user profile
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveProfileToStorage(newProfile);
  };

  // Add / Save issue
  const handleSaveIssue = (issue: CivicIssue) => {
    const existingIndex = issues.findIndex((i) => i.id === issue.id);
    if (existingIndex >= 0) {
      const updated = [...issues];
      updated[existingIndex] = issue;
      updateIssuesState(updated);
      setEditingIssue(null);
    } else {
      updateIssuesState([issue, ...issues]);
    }
  };

  // Update Status
  const handleUpdateIssueStatus = (
    issueId: string,
    newStatus: IssueStatus,
    notes: string,
    updatedBy: string
  ) => {
    const nowIso = new Date().toISOString();
    const updated = issues.map((item) => {
      if (item.id !== issueId) return item;

      const newHistory = [
        ...(item.statusHistory || []),
        {
          id: `sh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          status: newStatus,
          timestamp: nowIso,
          updatedBy: updatedBy || 'CivicDesk Desk Admin',
          notes: notes || `Status changed to ${newStatus}`,
        },
      ];

      return {
        ...item,
        currentStatus: newStatus,
        lastUpdatedAt: nowIso,
        statusHistory: newHistory,
        resolutionNotes:
          newStatus === 'Resolved' ? notes || item.resolutionNotes : item.resolutionNotes,
      };
    });

    updateIssuesState(updated);

    // Also update active modal if currently open
    if (activeIssueModal && activeIssueModal.id === issueId) {
      const updatedItem = updated.find((i) => i.id === issueId);
      if (updatedItem) setActiveIssueModal(updatedItem);
    }
  };

  // Delete Issue
  const handleDeleteIssue = (issueId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Complaint Record',
      message: `Are you sure you want to delete complaint ${issueId}? This will remove it from your local storage and cannot be undone.`,
      confirmLabel: 'Delete Record',
      variant: 'danger',
      onConfirm: () => {
        const filtered = issues.filter((i) => i.id !== issueId);
        updateIssuesState(filtered);
        setActiveIssueModal(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Complaint Deleted', `Issue ${issueId} was removed from records`);
      },
    });
  };

  // Reset Demo Issues
  const handleRequestResetDemo = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Demo Data',
      message: 'This will reset your local issue registry back to the default sample issues with attached photos and timestamps. Any custom issues you added will be overwritten.',
      confirmLabel: 'Reset Demo Data',
      variant: 'warning',
      onConfirm: () => {
        updateIssuesState(INITIAL_DEMO_ISSUES);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Demo Data Restored', 'Re-populated 7 realistic community issues');
      },
    });
  };

  // Clear All Issues
  const handleRequestClearAll = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Local Data',
      message: 'Are you sure you want to completely erase all local issues and history? This will leave your local registry empty.',
      confirmLabel: 'Erase Everything',
      variant: 'danger',
      onConfirm: () => {
        updateIssuesState([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('All Data Cleared', 'Local complaint database is now empty', 'warning');
      },
    });
  };

  // Import JSON
  const handleImportIssues = (imported: CivicIssue[], importedProfile?: UserProfile) => {
    updateIssuesState(imported);
    if (importedProfile) {
      handleUpdateProfile(importedProfile);
    }
  };

  // Navigate to tracking
  const handleNavigateToTracking = (id: string) => {
    setTrackedComplaintId(id);
    setActiveTab('tracking');
  };

  // Start edit
  const handleStartEdit = (issue: CivicIssue) => {
    setActiveIssueModal(null);
    setEditingIssue(issue);
    setActiveTab('report');
  };

  const pendingCount = issues.filter(
    (i) => i.currentStatus === 'Reported' || i.currentStatus === 'Under Review'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'report') setEditingIssue(null);
          setActiveTab(tab);
        }}
        pendingCount={pendingCount}
        totalCount={issues.length}
        userProfile={userProfile}
        theme={theme}
        onThemeChange={setTheme}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        <TopBar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onNavigateTab={(tab) => {
            if (tab === 'report') setEditingIssue(null);
            setActiveTab(tab);
          }}
          theme={theme}
          onThemeToggle={() =>
            setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              issues={issues}
              onSelectIssue={(issue) => setActiveIssueModal(issue)}
              onNavigateTab={(tab) => {
                if (tab === 'report') setEditingIssue(null);
                setActiveTab(tab);
              }}
              onTrackId={handleNavigateToTracking}
            />
          )}

          {activeTab === 'report' && (
            <ReportIssueForm
              initialIssue={editingIssue}
              userProfile={userProfile}
              onSubmit={handleSaveIssue}
              onCancel={
                editingIssue
                  ? () => {
                      setEditingIssue(null);
                      setActiveTab('issues');
                    }
                  : undefined
              }
              onNavigateToTracking={handleNavigateToTracking}
              onNavigateToIssues={() => setActiveTab('issues')}
            />
          )}

          {activeTab === 'issues' && (
            <IssueManagementPage
              issues={issues}
              onSelectIssue={(issue) => setActiveIssueModal(issue)}
              onEditIssue={handleStartEdit}
              onDeleteIssue={handleDeleteIssue}
              onNavigateToReport={() => {
                setEditingIssue(null);
                setActiveTab('report');
              }}
            />
          )}

          {activeTab === 'tracking' && (
            <ComplaintTrackingPage
              issues={issues}
              initialSearchId={trackedComplaintId}
              onOpenIssueModal={(issue) => setActiveIssueModal(issue)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage issues={issues} userProfile={userProfile} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              theme={theme}
              onThemeChange={setTheme}
              issues={issues}
              onImportIssues={handleImportIssues}
              onRequestResetDemo={handleRequestResetDemo}
              onRequestClearAll={handleRequestClearAll}
            />
          )}
        </main>

        {/* Global Footer & Privacy Notice */}
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 text-center no-print flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>CivicDesk Local Storage Engine · 100% Client-Side Civic Tech</span>
          </div>
          <div>
            Data is stored locally in your browser. Not automatically transmitted to government servers.
          </div>
        </footer>
      </div>

      {/* Issue Details & Timeline Modal */}
      <IssueDetailModal
        issue={activeIssueModal}
        isOpen={Boolean(activeIssueModal)}
        onClose={() => setActiveIssueModal(null)}
        onUpdateStatus={handleUpdateIssueStatus}
        onEdit={handleStartEdit}
        onDelete={handleDeleteIssue}
        defaultUserName={userProfile.defaultReporterName}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CivicDeskApp />
    </ToastProvider>
  );
}
