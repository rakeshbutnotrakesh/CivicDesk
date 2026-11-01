import React, { useState, useEffect } from 'react';
import {
  CivicIssue,
  IssueCategory,
  IssuePriority,
  UserProfile,
} from '../types';
import { CATEGORIES, PRIORITIES } from '../utils/helpers';
import { generateComplaintId } from '../utils/storage';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useToast } from './Toast';

interface ReportIssueFormProps {
  initialIssue?: CivicIssue | null;
  userProfile: UserProfile;
  onSubmit: (issue: CivicIssue) => void;
  onCancel?: () => void;
  onNavigateToTracking?: (complaintId: string) => void;
  onNavigateToIssues?: () => void;
}

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  initialIssue,
  userProfile,
  onSubmit,
  onCancel,
  onNavigateToTracking,
  onNavigateToIssues,
}) => {
  const { showToast } = useToast();
  const isEditing = Boolean(initialIssue);

  // Form State
  const [complaintId, setComplaintId] = useState<string>(
    initialIssue ? initialIssue.id : generateComplaintId()
  );
  const [title, setTitle] = useState(initialIssue?.title || '');
  const [description, setDescription] = useState(initialIssue?.description || '');
  const [category, setCategory] = useState<IssueCategory>(
    initialIssue?.category || 'Road and Transport'
  );
  const [priority, setPriority] = useState<IssuePriority>(
    initialIssue?.priority || 'Medium'
  );
  const [locality, setLocality] = useState(
    initialIssue?.locality || userProfile.neighborhoodName || ''
  );
  const [landmark, setLandmark] = useState(initialIssue?.landmark || '');

  // Format current ISO to YYYY-MM-DDTHH:mm for datetime-local input
  const getInitialDateTime = () => {
    if (initialIssue?.reportedAt) {
      return new Date(initialIssue.reportedAt).toISOString().slice(0, 16);
    }
    const now = new Date();
    // offset timezone
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  const [dateTime, setDateTime] = useState<string>(getInitialDateTime());
  const [reporterName, setReporterName] = useState(
    initialIssue?.reporterName || userProfile.defaultReporterName || ''
  );
  const [reporterContact, setReporterContact] = useState(
    initialIssue?.reporterContact || userProfile.defaultContact || ''
  );
  const [images, setImages] = useState<string[]>(initialIssue?.images || []);

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedIssue, setSubmittedIssue] = useState<CivicIssue | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!initialIssue) {
      setComplaintId(generateComplaintId());
    }
  }, [initialIssue]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Issue title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Please provide a descriptive title (at least 5 characters).';
    }

    if (!description.trim()) {
      newErrors.description = 'Detailed description is required.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please describe the issue in more detail (at least 15 characters).';
    }

    if (!locality.trim()) {
      newErrors.locality = 'Area or locality name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Read up to 3 images as base64
    Array.from(files).slice(0, 3).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Invalid File Type', 'Please upload an image file (JPG, PNG, WebP)', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('File Too Large', 'Images must be under 5MB each', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAttachSamplePhoto = () => {
    // Select one of the pre-generated sample photos matching category
    let sample = '/src/assets/images/civic_road_pothole_1793542707489.jpg';
    if (category === 'Electricity and Streetlights') {
      sample = '/src/assets/images/civic_broken_streetlight_1793542707199.jpg';
    } else if (category === 'Water Supply' || category === 'Drainage') {
      sample = '/src/assets/images/civic_water_leakage_1793542708058.jpg';
    } else if (category === 'Garbage and Sanitation') {
      sample = '/src/assets/images/civic_garbage_overflow_1793542707767.jpg';
    }
    setImages((prev) => [...prev, sample]);
    showToast('Sample Photo Attached', 'Loaded realistic photo evidence for testing');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please check the highlighted required fields', 'error');
      return;
    }

    const isoDate = new Date(dateTime).toISOString();
    const finalId = complaintId;

    const issueData: CivicIssue = {
      id: finalId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      locality: locality.trim(),
      landmark: landmark.trim() || undefined,
      reportedAt: isEditing && initialIssue ? initialIssue.reportedAt : isoDate,
      reporterName: reporterName.trim() || undefined,
      reporterContact: reporterContact.trim() || undefined,
      images,
      currentStatus: initialIssue ? initialIssue.currentStatus : 'Reported',
      statusHistory: initialIssue
        ? initialIssue.statusHistory
        : [
            {
              id: `sh-${Date.now()}`,
              status: 'Reported',
              timestamp: isoDate,
              updatedBy: reporterName.trim() || 'Citizen Reporter',
              notes: 'Initial complaint filed via CivicDesk portal.',
            },
          ],
      lastUpdatedAt: new Date().toISOString(),
    };

    onSubmit(issueData);

    if (isEditing) {
      showToast('Issue Updated', `Complaint ${finalId} has been successfully updated.`);
      if (onCancel) onCancel();
    } else {
      setSubmittedIssue(issueData);
      showToast('Complaint Submitted', `Registered with ID ${finalId}`);
    }
  };

  const handleCopyId = () => {
    if (!submittedIssue) return;
    navigator.clipboard.writeText(submittedIssue.id);
    setCopiedId(true);
    showToast('Copied to Clipboard', `Complaint ID ${submittedIssue.id}`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleResetForm = () => {
    setSubmittedIssue(null);
    setComplaintId(generateComplaintId());
    setTitle('');
    setDescription('');
    setCategory('Road and Transport');
    setPriority('Medium');
    setLandmark('');
    setImages([]);
    setErrors({});
  };

  // SUCCESS SUBMISSION VIEW
  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Complaint Registered
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Your community issue has been recorded in your local CivicDesk registry.
          </p>

          <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Your Unique Complaint ID
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums tracking-wide">
                {submittedIssue.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copiedId && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Copied to clipboard!
              </span>
            )}
          </div>

          <div className="text-left text-xs text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80 mb-6 space-y-1.5">
            <div><strong>Title:</strong> {submittedIssue.title}</div>
            <div><strong>Category:</strong> {submittedIssue.category} · <strong>Priority:</strong> {submittedIssue.priority}</div>
            <div><strong>Location:</strong> {submittedIssue.locality} {submittedIssue.landmark ? `(${submittedIssue.landmark})` : ''}</div>
            <div><strong>Status:</strong> {submittedIssue.currentStatus}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onNavigateToTracking && (
              <button
                type="button"
                onClick={() => onNavigateToTracking(submittedIssue.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Track This Complaint
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateToIssues && (
              <button
                type="button"
                onClick={onNavigateToIssues}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                View Issue Registry
              </button>
            )}

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Community Issue' : 'Report a Local Community Issue'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provide accurate details to assist local volunteers and community coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-500 dark:text-slate-400">ID:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
            {complaintId}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="issue-title" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
          Issue Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="issue-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="e.g. Hazardous pothole forming near school crosswalk"
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.title
              ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
              : 'border-slate-300 dark:border-slate-700'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Category & Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issue-category" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="issue-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as IssueCategory)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="issue-priority" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Priority <span className="text-rose-500">*</span>
          </label>
          <select
            id="issue-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as IssuePriority)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="block text-[11px] text-slate-500 mt-1">
            {priority === 'Critical' && 'Immediate danger or severe infrastructure stoppage.'}
            {priority === 'High' && 'Significant community hindrance or hazard.'}
            {priority === 'Medium' && 'Standard maintenance requirement.'}
            {priority === 'Low' && 'Cosmetic or minor convenience issue.'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="issue-description" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
          Detailed Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="issue-description"
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Describe what is broken, the extent of the damage, how long it has persisted, and any safety hazards."
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.description
              ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
              : 'border-slate-300 dark:border-slate-700'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Locality & Landmark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issue-locality" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Area or Locality Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="issue-locality"
            type="text"
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value);
              if (errors.locality) setErrors((prev) => ({ ...prev, locality: '' }));
            }}
            placeholder="e.g. Oakridge Ward 12, Maple Street"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500 ${
              errors.locality
                ? 'border-rose-400 dark:border-rose-600'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {errors.locality && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.locality}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="issue-landmark" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Optional Landmark
          </label>
          <input
            id="issue-landmark"
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near Community Center gate / Opposite Post Office"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Date & Time Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="issue-datetime" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Date and Time
          </label>
          <input
            id="issue-datetime"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="issue-reporter" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Reporter Name (Optional)
          </label>
          <input
            id="issue-reporter"
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Leave blank for Anonymous"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="issue-contact" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1.5">
            Reporter Contact (Optional)
          </label>
          <input
            id="issue-contact"
            type="text"
            value={reporterContact}
            onChange={(e) => setReporterContact(e.target.value)}
            placeholder="Email or phone for follow-up"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Photo Attachment via Browser File API */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
            Photo Attachment (File API)
          </label>
          <button
            type="button"
            onClick={handleAttachSamplePhoto}
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            Attach realistic sample photo
          </button>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Click to upload photographs
              </span>{' '}
              or drag & drop
            </div>
            <span className="text-[11px] text-slate-400">
              PNG, JPG, WebP up to 5MB (Stored in browser storage)
            </span>
          </label>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Save Changes' : 'Submit Issue Report'}
        </button>
      </div>
    </form>
  );
};
