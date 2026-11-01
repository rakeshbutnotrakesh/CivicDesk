import React from 'react';
import { CivicIssue, IssueStatus } from '../types';
import {
  CategoryDistributionChart,
  MonthlyTrendChart,
  PrioritySegmentBar,
} from './Charts';
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getRelativeTime,
} from '../utils/helpers';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderGit2,
  TrendingUp,
  PlusCircle,
  Search,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
  onNavigateTab: (tab: any) => void;
  onTrackId: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  issues,
  onSelectIssue,
  onNavigateTab,
  onTrackId,
}) => {
  const total = issues.length;
  const pending = issues.filter(
    (i) => i.currentStatus === 'Reported' || i.currentStatus === 'Under Review'
  ).length;
  const inProgress = issues.filter((i) => i.currentStatus === 'In Progress').length;
  const resolved = issues.filter((i) => i.currentStatus === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Recent complaints (last 5)
  const recentComplaints = [...issues]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 6);

  // Critical open issues
  const criticalIssues = issues.filter(
    (i) =>
      i.priority === 'Critical' &&
      i.currentStatus !== 'Resolved' &&
      i.currentStatus !== 'Rejected'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Civic Notice */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Local Civic Operations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Community Issue Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time neighborhood tracking, public works follow-ups, and municipal resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('report')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('tracking')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Track ID
          </button>
        </div>
      </div>

      {/* Critical alerts if any */}
      {criticalIssues.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                {criticalIssues.length} Critical Issue{criticalIssues.length > 1 ? 's' : ''} Requiring Immediate Attention
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('issues')}
              className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-0.5"
            >
              View in Registry
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {criticalIssues.map((ci) => (
              <div
                key={ci.id}
                onClick={() => onSelectIssue(ci)}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 cursor-pointer hover:border-rose-400 dark:hover:border-rose-700 transition-colors text-xs"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {ci.id}
                  </span>
                  <span className="text-slate-500">{ci.category}</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {ci.title}
                </p>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5 truncate">
                  {ci.locality}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Issues */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
            <span>Total Logged</span>
            <FolderGit2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {total}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Across neighborhood
          </span>
        </div>

        {/* Pending Issues */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {pending}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Awaiting assessment
          </span>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
            <span>In Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            {inProgress}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Field work active
          </span>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {resolved}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Fixed & confirmed
          </span>
        </div>

        {/* Resolution Rate */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
            <span>Resolution Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {resolutionRate}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Section: Category Distribution & Monthly Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Issue Category Distribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proportion of complaints across public infrastructure domains
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {total} reports
            </span>
          </div>

          <CategoryDistributionChart issues={issues} />
        </div>

        {/* Monthly Complaint Statistics */}
        <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Complaint Activity
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reported complaints versus verified resolutions over last 6 months
                </p>
              </div>
            </div>

            <MonthlyTrendChart issues={issues} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Priority Spread
            </span>
            <PrioritySegmentBar issues={issues} />
          </div>
        </div>
      </div>

      {/* Recent Complaints Feed */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Complaints
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest local problems submitted to the neighborhood desk
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('issues')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open All Issues
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No complaints on record</p>
            <p className="text-xs mt-1">Submit your first community issue to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentComplaints.map((item) => {
              const statusCol = getStatusColor(item.currentStatus);
              const priorityCol = getPriorityColor(item.priority);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectIssue(item)}
                  className="py-3 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                        {item.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusCol.badge}`}>
                        {item.currentStatus}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] ${priorityCol.badge}`}>
                        {item.priority}
                      </span>
                      <span className="text-slate-400 text-xs hidden sm:inline">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.locality}</span>
                      <span>·</span>
                      <span>{getRelativeTime(item.reportedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.images?.length > 0 && (
                      <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                        {item.images.length} photo{item.images.length > 1 ? 's' : ''}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
