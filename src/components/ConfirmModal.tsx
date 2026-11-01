import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'primary':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3
              id="confirm-modal-title"
              className="text-base font-semibold text-slate-900 dark:text-white"
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 ${getConfirmButtonClasses()}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
