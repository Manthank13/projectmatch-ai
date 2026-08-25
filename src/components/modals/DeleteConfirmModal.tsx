import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-container-low rounded-3xl p-6 border border-error-container shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined">delete_forever</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline text-on-surface">
              {title}
            </h3>
            <p className="text-xs font-body text-on-surface-variant">
              Confirm permanent removal
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-high border border-outline-variant/50 text-sm font-body text-on-surface mb-6">
          <p className="font-bold text-error mb-1">"{itemName}"</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 font-headline text-sm font-bold">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full hover:bg-surface-variant text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-error text-on-error hover:brightness-110 shadow-sm transition-all"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
};
