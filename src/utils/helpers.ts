import { IssueCategory, IssuePriority, IssueStatus } from '../types';

export const CATEGORIES: IssueCategory[] = [
  'Road and Transport',
  'Water Supply',
  'Electricity and Streetlights',
  'Garbage and Sanitation',
  'Drainage',
  'Public Safety',
  'Other',
];

export const PRIORITIES: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const STATUSES: IssueStatus[] = [
  'Reported',
  'Under Review',
  'In Progress',
  'Resolved',
  'Rejected',
];

export function getStatusColor(status: IssueStatus): {
  badge: string;
  dot: string;
  border: string;
  bgLight: string;
} {
  switch (status) {
    case 'Reported':
      return {
        badge: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
        dot: 'bg-sky-500',
        border: 'border-sky-400',
        bgLight: 'bg-sky-50 dark:bg-sky-950/40',
      };
    case 'Under Review':
      return {
        badge: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        border: 'border-amber-400',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      };
    case 'In Progress':
      return {
        badge: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        dot: 'bg-indigo-500',
        border: 'border-indigo-400',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      };
    case 'Resolved':
      return {
        badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        border: 'border-emerald-400',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      };
    case 'Rejected':
      return {
        badge: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
        border: 'border-rose-400',
        bgLight: 'bg-rose-50 dark:bg-rose-950/40',
      };
  }
}

export function getPriorityColor(priority: IssuePriority): {
  badge: string;
  indicator: string;
  border: string;
} {
  switch (priority) {
    case 'Low':
      return {
        badge: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        indicator: 'bg-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
      };
    case 'Medium':
      return {
        badge: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
        indicator: 'bg-blue-500',
        border: 'border-blue-200 dark:border-blue-900',
      };
    case 'High':
      return {
        badge: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
        indicator: 'bg-amber-500',
        border: 'border-amber-200 dark:border-amber-900',
      };
    case 'Critical':
      return {
        badge: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 font-semibold',
        indicator: 'bg-rose-500',
        border: 'border-rose-300 dark:border-rose-800',
      };
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getRelativeTime(isoString: string): string {
  try {
    const now = new Date().getTime();
    const then = new Date(isoString).getTime();
    const diffHours = Math.round((now - then) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}
