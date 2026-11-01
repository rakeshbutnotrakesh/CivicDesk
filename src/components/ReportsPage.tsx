import React from 'react';
import { CivicIssue, IssueCategory, IssuePriority, IssueStatus, UserProfile } from '../types';
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  getStatusColor,
  getPriorityColor,
  formatDate,
  formatDateTime,
} from '../utils/helpers';
import { exportIssuesToCsv } from '../utils/storage';
import {
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  FileText,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useToast } from './Toast';

interface ReportsPageProps {
  issues: CivicIssue[];
  userProfile: UserProfile;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ issues, userProfile }) => {
  const { showToast } = useToast();

  const total = issues.length;
  const reportedCount = issues.filter((i) => i.currentStatus === 'Reported').length;
  const underReviewCount = issues.filter((i) => i.currentStatus === 'Under Review').length;
  const inProgressCount = issues.filter((i) => i.currentStatus === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.currentStatus === 'Resolved').length;
  const rejectedCount = issues.filter((i) => i.currentStatus === 'Rejected').length;

  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Category stats
  const categoryStats = CATEGORIES.map((cat) => {
    const list = issues.filter((i) => i.category === cat);
    const resolved = list.filter((i) => i.currentStatus === 'Resolved').length;
    const rate = list.length > 0 ? Math.round((resolved / list.length) * 100) : 0;
    return {
      category: cat,
      count: list.length,
      resolved,
      pending: list.length - resolved,
      rate,
    };
  });

  // Priority stats
  const priorityStats = PRIORITIES.map((p) => {
    const list = issues.filter((i) => i.priority === p);
    const resolved = list.filter((i) => i.currentStatus === 'Resolved').length;
    return {
      priority: p,
      count: list.length,
      resolved,
      open: list.length - resolved,
    };
  });

  const handleExportCsv = () => {
    exportIssuesToCsv(issues);
    showToast('Export Complete', 'Downloaded complaint records in CSV format');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Civic Reports & Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated statistical summaries, municipal export logs, and printable community reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Complaints
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1 block">
            {total}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Logged across ward
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Active / Unresolved
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums mt-1 block">
            {total - resolvedCount - rejectedCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Reported, review, or in progress
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Resolved Issues
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Verified fixes completed
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Resolution Ratio
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums mt-1 block">
            {resolutionRate}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Overall closure efficiency
          </span>
        </div>
      </div>

      {/* Category-wise Statistics Table */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Category Breakdown & Performance
          </h2>
          <p className="text-xs text-slate-500">
            Complaints segregated by municipal public works division
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Total Logged</th>
                <th className="py-2.5 px-3 text-right">Resolved</th>
                <th className="py-2.5 px-3 text-right">Pending</th>
                <th className="py-2.5 px-3 text-right">Resolution Rate</th>
                <th className="py-2.5 px-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categoryStats.map((row) => (
                <tr key={row.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                    {row.category}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {row.count}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                    {row.resolved}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">
                    {row.pending}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {row.rate}%
                  </td>
                  <td className="py-3 px-3 w-32">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${row.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority-wise & Status-wise Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Status Stage Breakdown
          </h2>
          <p className="text-xs text-slate-500 mb-4">Current stage across all complaint files</p>

          <div className="space-y-3 text-xs">
            {STATUSES.map((st) => {
              const count = issues.filter((i) => i.currentStatus === st).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const stCol = getStatusColor(st);

              return (
                <div key={st} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stCol.dot}`} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{st}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                    <span className="text-slate-400">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Priority Distribution
          </h2>
          <p className="text-xs text-slate-500 mb-4">Urgency classification breakdown</p>

          <div className="space-y-3 text-xs">
            {priorityStats.map((row) => {
              const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
              const pCol = getPriorityColor(row.priority);

              return (
                <div key={row.priority} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${pCol.indicator}`} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-white">{row.count}</span>
                    <span className="text-slate-400">({pct}%)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                      ({row.resolved} resolved)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRINT-ONLY AUDIT DOSSIER */}
      <div className="print-only border border-black p-8 bg-white text-black space-y-6">
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CIVICDESK OFFICIAL COMPLAINT REGISTRY</h1>
            <p className="text-sm">Neighborhood: {userProfile.neighborhoodName} ({userProfile.wardNumber})</p>
            <p className="text-xs text-gray-600">Municipality / City: {userProfile.city}</p>
          </div>
          <div className="text-right text-xs">
            <p><strong>Report Generated:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Total Files:</strong> {total}</p>
            <p><strong>Resolution Ratio:</strong> {resolutionRate}%</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2">Executive Summary</h2>
          <p className="text-xs leading-relaxed text-gray-700">
            This dossier reflects local issue records compiled by residents and neighborhood coordinators. Records include civic infrastructure maintenance requests regarding roads, electrical systems, sanitation, and public safety.
          </p>
        </div>

        <table className="w-full text-left text-[11px] border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="p-2 border border-gray-400">ID</th>
              <th className="p-2 border border-gray-400">Title & Location</th>
              <th className="p-2 border border-gray-400">Category</th>
              <th className="p-2 border border-gray-400">Priority</th>
              <th className="p-2 border border-gray-400">Status</th>
              <th className="p-2 border border-gray-400">Reported</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id} className="border-b border-gray-300 page-break-inside-avoid">
                <td className="p-2 font-mono font-bold border border-gray-300">{i.id}</td>
                <td className="p-2 border border-gray-300">
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-gray-600">{i.locality} {i.landmark ? `(${i.landmark})` : ''}</div>
                </td>
                <td className="p-2 border border-gray-300">{i.category}</td>
                <td className="p-2 border border-gray-300">{i.priority}</td>
                <td className="p-2 border border-gray-300 font-semibold">{i.currentStatus}</td>
                <td className="p-2 border border-gray-300">{formatDate(i.reportedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-8 border-t border-gray-400 flex justify-between text-xs page-break-inside-avoid">
          <div>
            <p className="mb-8">Prepared by Citizen Liaison / Coordinator:</p>
            <p className="font-bold border-t border-gray-600 pt-1 w-48">{userProfile.defaultReporterName}</p>
          </div>
          <div>
            <p className="mb-8">Received by Municipal / Ward Authority:</p>
            <p className="font-bold border-t border-gray-600 pt-1 w-48">Signature & Date Stamp</p>
          </div>
        </div>
      </div>
    </div>
  );
};
