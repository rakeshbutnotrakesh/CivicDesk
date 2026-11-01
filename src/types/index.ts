export type IssueCategory =
  | 'Road and Transport'
  | 'Water Supply'
  | 'Electricity and Streetlights'
  | 'Garbage and Sanitation'
  | 'Drainage'
  | 'Public Safety'
  | 'Other';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus =
  | 'Reported'
  | 'Under Review'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export interface StatusUpdate {
  id: string;
  status: IssueStatus;
  timestamp: string; // ISO string
  updatedBy: string;
  notes?: string;
}

export interface CivicIssue {
  id: string; // e.g., 'CD-2026-8492'
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  locality: string;
  landmark?: string;
  reportedAt: string; // ISO string
  reporterName?: string;
  reporterContact?: string;
  images: string[]; // Base64 data URLs or asset URLs
  currentStatus: IssueStatus;
  statusHistory: StatusUpdate[];
  resolutionNotes?: string;
  lastUpdatedAt: string; // ISO string
}

export interface UserProfile {
  neighborhoodName: string;
  wardNumber: string;
  city: string;
  defaultReporterName: string;
  defaultContact: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type ActiveTab =
  | 'dashboard'
  | 'report'
  | 'issues'
  | 'tracking'
  | 'reports'
  | 'settings';
