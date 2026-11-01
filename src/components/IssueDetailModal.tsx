import React, { useState } from 'react';
import {
  CivicIssue,
  IssueStatus,
  StatusUpdate,
} from '../types';
import {
  formatDateTime,
  getStatusColor,
  getPriorityColor,
  STATUSES,
} from '../utils/helpers';
import {
  X,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  Clock,
  Printer,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from './Toast';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (issueId: string, newStatus: IssueStatus, notes: string, updatedBy: string) => void;
  onEdit: (issue: CivicIssue) => void;
  onDelete: (issueId: string) => void;
  defaultUserName?: string;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdateStatus,
  onEdit,
  onDelete,
  defaultUserName = 'Community Coordinator',
}) => {
  const { showToast } = useToast();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>(issue?.currentStatus || 'In Progress');
  const [statusNotes, setStatusNotes] = useState('');
  const [updaterName, setUpdaterName] = useState(defaultUserName);

  if (!isOpen || !issue) return null;

  const statusColors = getStatusColor(issue.currentStatus);
  const priorityColors = getPriorityColor(issue.priority);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    onUpdateStatus(
      issue.id,
      newStatus,
      statusNotes.trim() || `Status updated to ${newStatus}`,
      updaterName.trim() || 'CivicDesk Coordinator'
    );
    showToast('Status Updated', `Issue ${issue.id} is now ${newStatus}`);
    setShowStatusForm(false);
    setStatusNotes('');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
        <div
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl my-8 overflow-hidden transition-all animate-in fade-in zoom-in-95"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 tabular-nums">
                  {issue.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${statusColors.badge}`}>
                  {issue.currentStatus}
                </span>
                <span className={`px-2 py-0.5 rounded-full border text-xs ${priorityColors.badge}`}>
                  {issue.priority} Priority
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {issue.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {issue.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Problem Description
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                {issue.description}
              </p>
            </div>

            {/* Location & Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {issue.locality}
                  </span>
                  {issue.landmark && (
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      Landmark: {issue.landmark}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {formatDateTime(issue.reportedAt)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                    Last active: {formatDateTime(issue.lastUpdatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {issue.reporterName || 'Anonymous Resident'}
                  </span>
                  {issue.reporterContact && (
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                      {issue.reporterContact}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {issue.statusHistory?.length || 1} Timeline Event(s)
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                    Current stage: {issue.currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Attached Photos */}
            {issue.images && issue.images.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Attached Evidence ({issue.images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {issue.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setActivePhoto(img)}
                      className="group relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img
                        src={img}
                        alt={`Evidence photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
                        Click to enlarge
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update Action Drawer */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-950/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Update Local Status
                  </h3>
                </div>
                {!showStatusForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus(issue.currentStatus);
                      setShowStatusForm(true);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Change Status
                  </button>
                )}
              </div>

              {showStatusForm ? (
                <form onSubmit={handleStatusSubmit} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Updated By
                      </label>
                      <input
                        type="text"
                        value={updaterName}
                        onChange={(e) => setUpdaterName(e.target.value)}
                        placeholder="Coordinator name or role"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status Change Notes / Action Logged
                    </label>
                    <textarea
                      rows={2}
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="e.g. Inspected on site; forwarded municipal work order #521 to sanitation depot."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowStatusForm(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Save Status Update
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current state is <strong className="text-slate-700 dark:text-slate-300">{issue.currentStatus}</strong>. Update this record when work begins, is scheduled, or completes.
                </p>
              )}
            </div>

            {/* Status History Timeline */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Status Timeline & Log
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {issue.statusHistory && issue.statusHistory.length > 0 ? (
                  issue.statusHistory.map((item: StatusUpdate, idx: number) => {
                    const stColor = getStatusColor(item.status);
                    const isLatest = idx === issue.statusHistory.length - 1;

                    return (
                      <div key={item.id || idx} className="relative group">
                        <span
                          className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            isLatest ? 'bg-blue-600 ring-2 ring-blue-200 dark:ring-blue-900' : 'bg-slate-400'
                          }`}
                        />
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1">
                            <span className={`px-2 py-0.5 rounded-full border font-medium ${stColor.badge}`}>
                              {item.status}
                            </span>
                            <span className="font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                              {formatDateTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {item.notes || `Issue marked as ${item.status}`}
                          </p>
                          <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Logged by: {item.updatedBy || 'CivicDesk user'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Initial report logged.</p>
                )}
              </div>
            </div>

            {/* Disclaimer notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Local Civic Notice:</strong> Status changes and notes are kept in local storage for community tracking and citizen coordination. They do not constitute official municipal legal notices.
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintDossier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Print this issue dossier"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Dossier
              </button>
              <button
                type="button"
                onClick={() => onEdit(issue)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(issue.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for full size photo */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs no-print cursor-pointer"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-white/20 bg-black">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 text-white bg-black/60 p-2 rounded-full hover:bg-black transition-colors"
              aria-label="Close enlarged photo"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhoto}
              alt="Enlarged issue evidence"
              className="w-full h-full object-contain max-h-[85vh]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
};
