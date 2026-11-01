import { CivicIssue, UserProfile } from '../types';

export const STORAGE_KEYS = {
  ISSUES: 'civicdesk_issues_v1',
  PROFILE: 'civicdesk_profile_v1',
  THEME: 'civicdesk_theme_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  neighborhoodName: 'Greenwood Ward 14',
  wardNumber: 'Ward 14-B',
  city: 'Metro Civic District',
  defaultReporterName: 'Community Resident',
  defaultContact: 'resident@civicdesk.local',
};

export const INITIAL_DEMO_ISSUES: CivicIssue[] = [
  {
    id: 'CD-2026-1042',
    title: 'Broken streetlight fixture causing dark pedestrian corridor',
    description: 'The street lamp glass fixture shattered and the lamp head is hanging loose. The entire corner of 4th Street and Maple Avenue has no night lighting, posing a safety risk for evening commuters.',
    category: 'Electricity and Streetlights',
    priority: 'High',
    locality: 'Corner of 4th St & Maple Ave',
    landmark: 'Adjacent to Community Library gate',
    reportedAt: '2026-10-24T18:30:00.000Z',
    reporterName: 'David Chen',
    reporterContact: 'dchen@email.local',
    images: ['/src/assets/images/civic_broken_streetlight_1793542707199.jpg'],
    currentStatus: 'In Progress',
    statusHistory: [
      {
        id: 'sh-1',
        status: 'Reported',
        timestamp: '2026-10-24T18:30:00.000Z',
        updatedBy: 'Citizen David Chen',
        notes: 'Complaint logged with photographic evidence.',
      },
      {
        id: 'sh-2',
        status: 'Under Review',
        timestamp: '2026-10-25T09:15:00.000Z',
        updatedBy: 'Community Coordinator',
        notes: 'Inspected on site. Forwarded maintenance request to District Electrical Board.',
      },
      {
        id: 'sh-3',
        status: 'In Progress',
        timestamp: '2026-10-28T11:00:00.000Z',
        updatedBy: 'Maintenance Liaison',
        notes: 'Replacement LED fixture scheduled for bucket truck installation.',
      },
    ],
    lastUpdatedAt: '2026-10-28T11:00:00.000Z',
  },
  {
    id: 'CD-2026-1048',
    title: 'Hazardous deep asphalt pothole on residential transit lane',
    description: 'Large crater approximately 12 inches deep and 3 feet wide opened up after heavy seasonal rainfall. Vehicles are violently swerving into oncoming traffic lane to avoid wheel rim damage.',
    category: 'Road and Transport',
    priority: 'Critical',
    locality: 'Elm Street, between 8th and 9th Lane',
    landmark: 'In front of Elm Health Center',
    reportedAt: '2026-10-26T08:15:00.000Z',
    reporterName: 'Sarah Jenkins',
    reporterContact: 's.jenkins@neighborhood.org',
    images: ['/src/assets/images/civic_road_pothole_1793542707489.jpg'],
    currentStatus: 'Under Review',
    statusHistory: [
      {
        id: 'sh-4',
        status: 'Reported',
        timestamp: '2026-10-26T08:15:00.000Z',
        updatedBy: 'Citizen Sarah Jenkins',
        notes: 'Pothole rapidly expanding due to rainwater accumulation.',
      },
      {
        id: 'sh-5',
        status: 'Under Review',
        timestamp: '2026-10-26T14:20:00.000Z',
        updatedBy: 'Public Works Desk',
        notes: 'Marked with safety barrier cone while hot-mix asphalt patching crew is routed.',
      },
    ],
    lastUpdatedAt: '2026-10-26T14:20:00.000Z',
  },
  {
    id: 'CD-2026-1033',
    title: 'High-pressure water distribution valve continuous leak',
    description: 'Municipal water line valve fixture leaking clean pressurized drinking water continuously along the gutter curb. Thousands of liters wasted daily and eroding road foundation.',
    category: 'Water Supply',
    priority: 'High',
    locality: 'West End Boulevard, Block 4',
    landmark: 'Opposite Government Primary School',
    reportedAt: '2026-10-18T07:45:00.000Z',
    reporterName: 'Marcus Vance',
    reporterContact: 'marcus.v@localnet.org',
    images: ['/src/assets/images/civic_water_leakage_1793542708058.jpg'],
    currentStatus: 'Resolved',
    statusHistory: [
      {
        id: 'sh-6',
        status: 'Reported',
        timestamp: '2026-10-18T07:45:00.000Z',
        updatedBy: 'Resident Marcus Vance',
        notes: 'Gushing leak noticed early morning.',
      },
      {
        id: 'sh-7',
        status: 'Under Review',
        timestamp: '2026-10-18T10:00:00.000Z',
        updatedBy: 'CivicDesk Desk Admin',
        notes: 'Priority alert sent to Water Supply & Sewerage Board.',
      },
      {
        id: 'sh-8',
        status: 'In Progress',
        timestamp: '2026-10-19T13:30:00.000Z',
        updatedBy: 'Water Board Technician',
        notes: 'Main line isolated; replacement gasket and valve sleeve being installed.',
      },
      {
        id: 'sh-9',
        status: 'Resolved',
        timestamp: '2026-10-20T16:00:00.000Z',
        updatedBy: 'CivicDesk Verification',
        notes: 'Valve successfully repaired and pressure tested. No further leakage detected.',
      },
    ],
    resolutionNotes: 'New brass high-pressure seal installed and certified dry on October 20.',
    lastUpdatedAt: '2026-10-20T16:00:00.000Z',
  },
  {
    id: 'CD-2026-1055',
    title: 'Overflowing commercial waste bin & uncollected recycling',
    description: 'Sanitation collection skipped this corner for over 5 days. 240L bins are overflowing onto public walkway, creating pungent odors and attracting stray animals and pests.',
    category: 'Garbage and Sanitation',
    priority: 'Medium',
    locality: 'Market Square North, Plaza Alley',
    landmark: 'Behind Old Town Grocery Depot',
    reportedAt: '2026-10-29T10:00:00.000Z',
    reporterName: 'Priya Patel',
    reporterContact: 'priya.patel@citymail.com',
    images: ['/src/assets/images/civic_garbage_overflow_1793542707767.jpg'],
    currentStatus: 'Reported',
    statusHistory: [
      {
        id: 'sh-10',
        status: 'Reported',
        timestamp: '2026-10-29T10:00:00.000Z',
        updatedBy: 'Citizen Priya Patel',
        notes: 'Overflowing garbage blocking sidewalk accessibility ramp.',
      },
    ],
    lastUpdatedAt: '2026-10-29T10:00:00.000Z',
  },
  {
    id: 'CD-2026-1019',
    title: 'Severe storm drain clogging with heavy sediment and plastic debris',
    description: 'Grated storm intake inlet is 80% choked by dried foliage and urban runoff debris. Anticipated monsoon storms will cause street surface flooding if not cleared.',
    category: 'Drainage',
    priority: 'High',
    locality: 'Highland Terrace, Sector 3',
    landmark: 'Corner of Pine Road culvert',
    reportedAt: '2026-10-12T11:20:00.000Z',
    reporterName: 'Robert Gomez',
    reporterContact: 'rgomez@metro.local',
    images: [],
    currentStatus: 'Resolved',
    statusHistory: [
      {
        id: 'sh-11',
        status: 'Reported',
        timestamp: '2026-10-12T11:20:00.000Z',
        updatedBy: 'Robert Gomez',
        notes: 'Culvert clogged before monsoon forecast.',
      },
      {
        id: 'sh-12',
        status: 'In Progress',
        timestamp: '2026-10-14T09:00:00.000Z',
        updatedBy: 'Sanitation Crew',
        notes: 'Silt pump and manual dredging deployed.',
      },
      {
        id: 'sh-13',
        status: 'Resolved',
        timestamp: '2026-10-15T15:30:00.000Z',
        updatedBy: 'Community Coordinator',
        notes: 'Culvert cleared and grating secured with anti-debris wire mesh.',
      },
    ],
    resolutionNotes: 'De-silted 180 meters of drainage line. Flow confirmed normal.',
    lastUpdatedAt: '2026-10-15T15:30:00.000Z',
  },
  {
    id: 'CD-2026-1061',
    title: 'Damaged pedestrian guardrail near school crosswalk',
    description: 'Metal railing fractured following a delivery truck collision last Friday. Sharp rusted edges exposed right where schoolchildren assemble before morning crosswalk patrol.',
    category: 'Public Safety',
    priority: 'Critical',
    locality: 'Oakridge Avenue & 12th Way',
    landmark: 'Directly outside Valley Middle School',
    reportedAt: '2026-10-31T09:10:00.000Z',
    reporterName: 'Anita Roy',
    reporterContact: 'anita.pta@oakridge.edu',
    images: [],
    currentStatus: 'Reported',
    statusHistory: [
      {
        id: 'sh-14',
        status: 'Reported',
        timestamp: '2026-10-31T09:10:00.000Z',
        updatedBy: 'Anita Roy (PTA Coordinator)',
        notes: 'Immediate danger to crossing students due to sharp sheared metal.',
      },
    ],
    lastUpdatedAt: '2026-10-31T09:10:00.000Z',
  },
  {
    id: 'CD-2026-1004',
    title: 'Missing manhole cover on unlit service lane',
    description: 'Cast iron manhole cover was displaced or stolen. Left open with no warning signage on a dimly illuminated lane frequently traversed by cyclists.',
    category: 'Public Safety',
    priority: 'Critical',
    locality: 'Cedar Lane service road',
    landmark: '50m east of Railway Overhead Bridge',
    reportedAt: '2026-10-05T20:10:00.000Z',
    reporterName: 'Kenji Sato',
    reporterContact: 'kenji.s@local.net',
    images: [],
    currentStatus: 'Resolved',
    statusHistory: [
      {
        id: 'sh-15',
        status: 'Reported',
        timestamp: '2026-10-05T20:10:00.000Z',
        updatedBy: 'Kenji Sato',
        notes: 'Urgent hazard reported.',
      },
      {
        id: 'sh-16',
        status: 'In Progress',
        timestamp: '2026-10-06T06:00:00.000Z',
        updatedBy: 'Emergency Highway Patrol',
        notes: 'Temporary barricade placed.',
      },
      {
        id: 'sh-17',
        status: 'Resolved',
        timestamp: '2026-10-06T14:45:00.000Z',
        updatedBy: 'Municipal Works',
        notes: 'Heavy-duty composite locking manhole lid installed.',
      },
    ],
    resolutionNotes: 'Reinforced lockable cover installed.',
    lastUpdatedAt: '2026-10-06T14:45:00.000Z',
  },
];

// Helper to safely read from LocalStorage
export function loadIssuesFromStorage(): CivicIssue[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ISSUES);
    if (!raw) {
      // First run: load initial demo data
      saveIssuesToStorage(INITIAL_DEMO_ISSUES);
      return INITIAL_DEMO_ISSUES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_ISSUES;
  } catch (err) {
    console.error('Error loading CivicDesk issues from localStorage:', err);
    return INITIAL_DEMO_ISSUES;
  }
}

export function saveIssuesToStorage(issues: CivicIssue[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  } catch (err) {
    console.error('Failed to save CivicDesk issues to localStorage:', err);
  }
}

export function loadProfileFromStorage(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfileToStorage(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

// Generate unique complaint ID like CD-2026-9281
export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CD-${year}-${randomSuffix}`;
}

// Export issues as CSV
export function exportIssuesToCsv(issues: CivicIssue[]): void {
  const headers = [
    'Complaint ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Locality',
    'Landmark',
    'Reported Date',
    'Reporter Name',
    'Reporter Contact',
    'Last Updated',
    'Has Images',
    'Notes Count',
  ];

  const escapeCsv = (str?: string) => {
    if (!str) return '""';
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = issues.map((issue) => [
    escapeCsv(issue.id),
    escapeCsv(issue.title),
    escapeCsv(issue.category),
    escapeCsv(issue.priority),
    escapeCsv(issue.currentStatus),
    escapeCsv(issue.locality),
    escapeCsv(issue.landmark || 'N/A'),
    escapeCsv(new Date(issue.reportedAt).toLocaleString()),
    escapeCsv(issue.reporterName || 'Anonymous'),
    escapeCsv(issue.reporterContact || 'Not provided'),
    escapeCsv(new Date(issue.lastUpdatedAt).toLocaleString()),
    escapeCsv(issue.images?.length ? `${issue.images.length} photo(s)` : 'None'),
    escapeCsv(String(issue.statusHistory?.length || 0)),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `civicdesk-issues-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export all application data as JSON
export function exportDataToJson(issues: CivicIssue[], profile: UserProfile): void {
  const payload = {
    app: 'CivicDesk',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profile,
    issues,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `civicdesk-backup-${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import data from JSON
export function parseAndValidateImportJson(jsonStr: string): {
  success: boolean;
  issues?: CivicIssue[];
  profile?: UserProfile;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'File is not a valid JSON object.' };
    }
    const issues = Array.isArray(data.issues) ? data.issues : Array.isArray(data) ? data : null;
    if (!issues) {
      return { success: false, error: 'No issues array found in the uploaded file.' };
    }

    // Validate issue structure
    const validIssues: CivicIssue[] = [];
    for (const item of issues) {
      if (item.id && item.title && item.category && item.priority && item.currentStatus) {
        validIssues.push({
          id: String(item.id),
          title: String(item.title),
          description: String(item.description || ''),
          category: item.category,
          priority: item.priority,
          locality: String(item.locality || 'Locality unspecified'),
          landmark: item.landmark ? String(item.landmark) : undefined,
          reportedAt: item.reportedAt || new Date().toISOString(),
          reporterName: item.reporterName ? String(item.reporterName) : undefined,
          reporterContact: item.reporterContact ? String(item.reporterContact) : undefined,
          images: Array.isArray(item.images) ? item.images : [],
          currentStatus: item.currentStatus,
          statusHistory: Array.isArray(item.statusHistory) ? item.statusHistory : [],
          resolutionNotes: item.resolutionNotes ? String(item.resolutionNotes) : undefined,
          lastUpdatedAt: item.lastUpdatedAt || new Date().toISOString(),
        });
      }
    }

    if (validIssues.length === 0) {
      return { success: false, error: 'No valid complaint items found in the file.' };
    }

    return {
      success: true,
      issues: validIssues,
      profile: data.profile || undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: `JSON parse error: ${err instanceof Error ? err.message : 'Invalid JSON file'}`,
    };
  }
}

// Download the complete project codebase repository JSON bundle
export async function downloadProjectRepositoryJson(): Promise<void> {
  try {
    const res = await fetch('/civicdesk-repository.json');
    if (!res.ok) throw new Error('Could not fetch civicdesk-repository.json');
    const data = await res.blob();
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'civicdesk-repository.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download project repository JSON:', err);
    throw err;
  }
}

