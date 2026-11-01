import React, { useState, useEffect } from 'react';
import { CivicIssue, IssueStatus, StatusUpdate } from '../types';
import {
  getStatusColor,
  getPriorityColor,
  formatDateTime,
  formatDate,
} from '../utils/helpers';
import {
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Printer,
  ShieldCheck,
  FileCheck2,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';
import { useToast } from './Toast';

interface ComplaintTrackingPageProps {
  issues: CivicIssue[];
  initialSearchId?: string;
  onOpenIssueModal: (issue: CivicIssue) => void;
}

export const ComplaintTrackingPage: React.FC<ComplaintTrackingPageProps> = ({
  issues,
  initialSearchId,
  onOpenIssueModal,
}) => {
  const { showToast } = useToast();
  const [searchInput, setSearchInput] = useState(initialSearchId || '');
  const [searchedId, setSearchedId] = useState(initialSearchId || '');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  useEffect(() => {
    if (initialSearchId) {
      setSearchInput(initialSearchId);
      setSearchedId(initialSearchId);
      const match = issues.find(
        (i) => i.id.toLowerCase() === initialSearchId.toLowerCase().trim()
      );
      setSelectedIssue(match || null);
    }
  }, [initialSearchId, issues]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    setSearchedId(query);

    if (!query) {
      setSelectedIssue(null);
      return;
    }

    const match = issues.find(
      (i) => i.id.toUpperCase() === query || i.id.toUpperCase().includes(query)
    );
    if (match) {
      setSelectedIssue(match);
      showToast('Complaint Located', `Loaded dossier for ${match.id}`);
    } else {
      setSelectedIssue(null);
      showToast('Record Not Found', `No complaint found matching "${query}"`, 'warning');
    }
  };

  const handleQuickDemoClick = (demoId: string) => {
    setSearchInput(demoId);
    setSearchedId(demoId);
    const match = issues.find((i) => i.id === demoId);
    setSelectedIssue(match || null);
  };

  const sampleDemoIds = issues.slice(0, 4).map((i) => i.id);

  // Workflow steps definition
  const WORKFLOW_STEPS: IssueStatus[] = [
    'Reported',
    'Under Review',
    'In Progress',
    'Resolved',
  ];

  const getStepState = (step: IssueStatus, current: IssueStatus) => {
    if (current === 'Rejected') {
      return step === 'Reported' ? 'completed' : 'inactive';
    }
    const order = ['Reported', 'Under Review', 'In Progress', 'Resolved'];
    const currentIndex = order.indexOf(current);
    const stepIndex = order.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Search Bar */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Complaint Tracking Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Look up the real-time progress, field logs, and verification status of any logged complaint.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CD-2026-1042)"
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono uppercase outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSelectedIssue(null);
                  setSearchedId('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Track Complaint
          </button>
        </form>

        {/* Demo ID quick links */}
        {sampleDemoIds.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Try demo ID:</span>
            {sampleDemoIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleQuickDemoClick(id)}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono transition-colors text-[11px]"
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {selectedIssue ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Card */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
            {/* Top Bar with ID and Status */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {selectedIssue.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                      getStatusColor(selectedIssue.currentStatus).badge
                    }`}
                  >
                    {selectedIssue.currentStatus}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-xs ${
                      getPriorityColor(selectedIssue.priority).badge
                    }`}
                  >
                    {selectedIssue.priority} Priority
                  </span>
                  <span className="text-slate-500">{selectedIssue.category}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedIssue.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => onOpenIssueModal(selectedIssue)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Manage Status
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual Lifecycle Progress Bar */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Resolution Workflow Stage
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const state = getStepState(step, selectedIssue.currentStatus);

                  let bgBorder = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400';
                  if (state === 'completed') {
                    bgBorder = 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
                  } else if (state === 'current') {
                    bgBorder = 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-200 ring-2 ring-blue-500/20';
                  }

                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition-all ${bgBorder}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-semibold opacity-75">
                          0{idx + 1}
                        </span>
                        {state === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {state === 'current' && (
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {step}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {state === 'completed'
                          ? 'Passed'
                          : state === 'current'
                          ? 'Active Stage'
                          : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {selectedIssue.currentStatus === 'Rejected' && (
                <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
                  <strong>Notice:</strong> This complaint has been evaluated and marked as Rejected (e.g. duplicate submission or outside community jurisdiction).
                </div>
              )}
            </div>

            {/* Problem Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Incident Details
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                {selectedIssue.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 block mb-1">Locality</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {selectedIssue.locality}
                </span>
                {selectedIssue.landmark && (
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Near {selectedIssue.landmark}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 block mb-1">Filing Date</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {formatDateTime(selectedIssue.reportedAt)}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  By {selectedIssue.reporterName || 'Anonymous Citizen'}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 block mb-1">Last Update Logged</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {formatDateTime(selectedIssue.lastUpdatedAt)}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  {selectedIssue.statusHistory?.length || 1} action entry(ies)
                </span>
              </div>
            </div>

            {/* Photos */}
            {selectedIssue.images && selectedIssue.images.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Attached Photographs ({selectedIssue.images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedIssue.images.map((photo, i) => (
                    <div
                      key={i}
                      className="aspect-4/3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                    >
                      <img
                        src={photo}
                        alt={`Evidence ${i + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Timeline History */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Status History & Field Action Log
              </h3>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {selectedIssue.statusHistory && selectedIssue.statusHistory.length > 0 ? (
                  selectedIssue.statusHistory.map((item: StatusUpdate, idx: number) => {
                    const stColor = getStatusColor(item.status);
                    return (
                      <div key={item.id || idx} className="relative">
                        <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1">
                            <span className={`px-2 py-0.5 rounded-full border font-medium ${stColor.badge}`}>
                              {item.status}
                            </span>
                            <span className="font-mono text-slate-400 tabular-nums">
                              {formatDateTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                            {item.notes || 'Status changed.'}
                          </p>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Logged by: {item.updatedBy || 'CivicDesk Registry'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">No previous updates recorded.</p>
                )}
              </div>
            </div>

            {/* Official Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Info className="w-4 h-4 text-blue-500" />
                <span>Notice on CivicDesk Tracking</span>
              </div>
              <p className="leading-relaxed">
                Status changes in CivicDesk are locally managed by neighborhood coordinators, volunteers, or resident associations. They provide a community audit trail and do not represent official government municipal updates unless submitted to the municipal council.
              </p>
            </div>
          </div>
        </div>
      ) : searchedId ? (
        <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No complaint found for "{searchedId}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Please check the spelling of your Complaint ID. IDs usually begin with "CD-2026-".
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchedId('');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileCheck2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Search Any Neighborhood Complaint
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Citizens can enter their complaint tracking code above to inspect progress, verification notes, and resolution status.
          </p>
        </div>
      )}
    </div>
  );
};
