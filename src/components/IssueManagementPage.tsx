import React, { useState, useMemo } from 'react';
import {
  CivicIssue,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from '../types';
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  getStatusColor,
  getPriorityColor,
  formatDate,
  getRelativeTime,
} from '../utils/helpers';
import {
  Search,
  Filter,
  Grid,
  List,
  ArrowUpDown,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';

interface IssueManagementPageProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
  onEditIssue: (issue: CivicIssue) => void;
  onDeleteIssue: (issueId: string) => void;
  onNavigateToReport: () => void;
}

export const IssueManagementPage: React.FC<IssueManagementPageProps> = ({
  issues,
  onSelectIssue,
  onEditIssue,
  onDeleteIssue,
  onNavigateToReport,
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'title'>('newest');

  // Filtered & Sorted Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchId = issue.id.toLowerCase().includes(query);
        const matchTitle = issue.title.toLowerCase().includes(query);
        const matchDesc = issue.description.toLowerCase().includes(query);
        const matchLoc = issue.locality.toLowerCase().includes(query);
        const matchLandmark = issue.landmark?.toLowerCase().includes(query);
        const matchReporter = issue.reporterName?.toLowerCase().includes(query);

        if (!matchId && !matchTitle && !matchDesc && !matchLoc && !matchLandmark && !matchReporter) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) {
        return false;
      }

      // Priority
      if (selectedPriority !== 'All' && issue.priority !== selectedPriority) {
        return false;
      }

      // Status
      if (selectedStatus !== 'All' && issue.currentStatus !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeights: Record<IssuePriority, number> = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [issues, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedPriority !== 'All' ||
    selectedStatus !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Issue Management Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse, filter, edit, and organize all community problems in your locality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateToReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Mode */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (e.g. CD-2026), title, street, locality..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dense Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium hidden sm:inline">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (Critical First)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredIssues.length}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{issues.length}</strong> complaints
        </span>
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching complaints found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {hasActiveFilters
              ? 'Try adjusting your search keywords, priority, or category filters.'
              : 'No complaints have been recorded yet in your neighborhood desk.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToReport}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Report First Issue
              </button>
            )}
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {viewMode === 'card' && filteredIssues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => {
            const statusCol = getStatusColor(issue.currentStatus);
            const priorityCol = getPriorityColor(issue.priority);

            return (
              <div
                key={issue.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all overflow-hidden group"
              >
                {/* Optional Image Banner if issue has photo */}
                {issue.images && issue.images.length > 0 && (
                  <div
                    onClick={() => onSelectIssue(issue)}
                    className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[11px] font-mono">
                      {issue.images.length} photo{issue.images.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Top line metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {issue.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusCol.badge}`}>
                      {issue.currentStatus}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectIssue(issue)}
                    className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                  >
                    {issue.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed flex-1">
                    {issue.description}
                  </p>

                  {/* Location & category */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{issue.locality}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span>{issue.category}</span>
                      <span className={`px-1.5 py-0.5 rounded border ${priorityCol.badge}`}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {getRelativeTime(issue.reportedAt)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditIssue(issue)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Edit Issue"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteIssue(issue.id)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                      title="Delete Issue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DENSE LIST / TABLE VIEW */}
      {viewMode === 'list' && filteredIssues.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Title & Locality</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.map((issue) => {
                const statusCol = getStatusColor(issue.currentStatus);
                const priorityCol = getPriorityColor(issue.priority);

                return (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {issue.id}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div
                        onClick={() => onSelectIssue(issue)}
                        className="font-medium text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {issue.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {issue.locality}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {issue.category}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] ${priorityCol.badge}`}>
                        {issue.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusCol.badge}`}>
                        {issue.currentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono tabular-nums">
                      {formatDate(issue.reportedAt)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectIssue(issue)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditIssue(issue)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteIssue(issue.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
