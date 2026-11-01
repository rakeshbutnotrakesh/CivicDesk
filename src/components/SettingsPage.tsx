import React, { useState } from 'react';
import { UserProfile, ThemeMode, CivicIssue } from '../types';
import {
  exportDataToJson,
  parseAndValidateImportJson,
  downloadProjectRepositoryJson,
} from '../utils/storage';
import {
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  HardDrive,
  Users,
  Copy,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { useToast } from './Toast';

interface SettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  issues: CivicIssue[];
  onImportIssues: (issues: CivicIssue[], profile?: UserProfile) => void;
  onRequestResetDemo: () => void;
  onRequestClearAll: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  onUpdateProfile,
  theme,
  onThemeChange,
  issues,
  onImportIssues,
  onRequestResetDemo,
  onRequestClearAll,
}) => {
  const { showToast } = useToast();

  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedGitCmds, setCopiedGitCmds] = useState(false);

  const gitPushCommand = `git init
git add .
git commit -m "Initial commit of CivicDesk"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/civicdesk.git
git push -u origin main`;

  const handleCopyGitCmds = () => {
    navigator.clipboard.writeText(gitPushCommand);
    setCopiedGitCmds(true);
    showToast('Copied Git Commands', 'Git push commands copied to clipboard');
    setTimeout(() => setCopiedGitCmds(false), 2500);
  };

  const handleDownloadCodebase = async () => {
    try {
      await downloadProjectRepositoryJson();
      showToast('Codebase Exported', 'Downloading civicdesk-repository.json');
    } catch {
      showToast('Download Failed', 'Could not download repository JSON file', 'error');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    showToast('Profile Saved', 'Your neighborhood settings have been saved');
  };

  const handleExportBackup = () => {
    exportDataToJson(issues, profileForm);
    showToast('Backup Created', 'Downloaded full CivicDesk backup in JSON format');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        processJsonImport(content);
      }
    };
    reader.readAsText(file);
  };

  const processJsonImport = (jsonStr: string) => {
    const result = parseAndValidateImportJson(jsonStr);
    if (!result.success || !result.issues) {
      setImportError(result.error || 'Failed to parse JSON file');
      showToast('Import Failed', result.error || 'Invalid JSON format', 'error');
      return;
    }

    onImportIssues(result.issues, result.profile);
    setImportError(null);
    setShowImportBox(false);
    setImportJsonText('');
    showToast(
      'Import Successful',
      `Restored ${result.issues.length} complaint record(s) from backup`
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          System Settings & Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your local ward settings, theme preferences, and data backups.
        </p>
      </div>

      {/* Theme Appearance */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Theme & Display
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Choose your interface appearance preference
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            Light
          </button>

          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            Dark
          </button>

          <button
            type="button"
            onClick={() => onThemeChange('system')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
              theme === 'system'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-slate-400" />
            System
          </button>
        </div>
      </div>

      {/* User & Neighborhood Profile Settings */}
      <form
        onSubmit={handleProfileSubmit}
        className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Neighborhood & Coordinator Profile
            </h2>
            <p className="text-xs text-slate-500">
              Preset information automatically applied when creating new reports
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Neighborhood / Area Name
            </label>
            <input
              type="text"
              value={profileForm.neighborhoodName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, neighborhoodName: e.target.value })
              }
              placeholder="e.g. Greenwood Ward 14"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ward / Zone Number
            </label>
            <input
              type="text"
              value={profileForm.wardNumber}
              onChange={(e) =>
                setProfileForm({ ...profileForm, wardNumber: e.target.value })
              }
              placeholder="e.g. Ward 14-B"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              City / Municipality
            </label>
            <input
              type="text"
              value={profileForm.city}
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              placeholder="e.g. Metro Civic District"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Default Coordinator / Reporter Name
            </label>
            <input
              type="text"
              value={profileForm.defaultReporterName}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  defaultReporterName: e.target.value,
                })
              }
              placeholder="e.g. Community Coordinator"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Default Contact Email or Phone
            </label>
            <input
              type="text"
              value={profileForm.defaultContact}
              onChange={(e) =>
                setProfileForm({ ...profileForm, defaultContact: e.target.value })
              }
              placeholder="e.g. coordinator@neighborhood.local"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>

      {/* Data Management & Backups */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Data Storage & Backup Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <strong className="font-mono text-slate-900 dark:text-white">{issues.length}</strong> complaints stored in your browser's persistent LocalStorage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-white block mb-1">
                Backup to JSON File
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Download all complaints, history logs, and profile settings in a single portable JSON file.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Backup (JSON)
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-white block mb-1">
                Restore from JSON Backup
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Upload a previously exported CivicDesk JSON file to restore records.
              </p>
            </div>
            <div>
              <input
                type="file"
                id="json-file-input"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="json-file-input"
                className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Import JSON File
              </label>
            </div>
          </div>
        </div>

        {/* GitHub Codebase Export (.json) */}
        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  GitHub Codebase Bundle (civicdesk-repository.json)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Complete bundle of all 26 source files, TypeScript types, configs, and assets ready to push directly to GitHub.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadCodebase}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Project (.json)
              </button>
              <button
                type="button"
                onClick={handleCopyGitCmds}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedGitCmds ? 'Copied!' : 'Copy Git Push'}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-md bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-0.5 select-all">
            <div className="text-slate-400"># Direct Git Push to your GitHub repository:</div>
            <div>git init && git add .</div>
            <div>git commit -m "Initial commit: CivicDesk Local Issue Management"</div>
            <div>git branch -M main</div>
            <div>git remote add origin https://github.com/YOUR_USERNAME/civicdesk.git</div>
            <div>git push -u origin main</div>
          </div>
        </div>

        {importError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Reset & Wipe Danger Zone */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRequestResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Issues
            </button>
          </div>

          <button
            type="button"
            onClick={onRequestClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Local Data
          </button>
        </div>
      </div>

      {/* About CivicDesk, Privacy & Legal Limitations */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            About CivicDesk & Privacy Disclaimers
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            <strong>100% Client-Side Architecture:</strong> CivicDesk runs completely within your web browser. No external cloud servers, databases, or third-party tracking APIs receive your data.
          </p>

          <p>
            <strong>Local Storage Guarantee:</strong> All complaint records, reporter contact info, notes, and attached photographs are stored securely in your browser's LocalStorage and File API cache. Photos remain within your browser unless you deliberately export them via CSV or JSON backup.
          </p>

          <p>
            <strong>Not an Official Government System:</strong> CivicDesk is designed for civic groups, neighborhood associations, ward committees, and active citizens to compile and coordinate community issues. Filing a complaint in CivicDesk does <em>not</em> automatically forward a ticket to municipal, police, or state departments.
          </p>

          <p>
            <strong>Actionable Recommendations:</strong> Use the <em>Print Report</em> or <em>Export CSV</em> features in the Reports tab to print official paper dossiers or email spreadsheets to your local municipal ward councillor or public works office during council sessions.
          </p>
        </div>
      </div>
    </div>
  );
};
