import React, { useRef, useState } from 'react';
import { ResumeDocument } from '../../types';

interface ResumeUploadProps {
  resume?: ResumeDocument;
  onResumeChange: (resume: ResumeDocument | undefined) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  resume,
  onResumeChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const isValidType = file.name.match(/\.(pdf|doc|docx)$/i);
    if (!isValidType) {
      alert('Please upload a PDF, DOC, or DOCX resume document.');
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const reader = new FileReader();
    reader.onload = (e) => {
      onResumeChange({
        name: file.name,
        size: sizeFormatted,
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dataUrl: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-headline font-bold text-on-surface uppercase tracking-wider">
        Resume Document (PDF / DOCX)
      </label>

      {resume ? (
        <div className="p-4 rounded-2xl glass-panel border border-secondary-container/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 truncate">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div className="truncate">
              <p className="font-headline font-bold text-xs text-on-surface truncate">
                {resume.name}
              </p>
              <p className="text-[11px] font-body text-on-surface-variant">
                {resume.size} • Uploaded {resume.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-headline text-xs font-bold flex-shrink-0">
            {resume.dataUrl && (
              <a
                href={resume.dataUrl}
                download={resume.name}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-variant border border-outline-variant text-primary flex items-center gap-1 transition-colors"
                title="Download / View document"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span className="hidden sm:inline">View</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-variant border border-outline-variant text-on-surface transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onResumeChange(undefined)}
              className="p-1.5 rounded-xl hover:bg-error-container/40 text-error transition-colors"
              title="Remove resume"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-secondary bg-secondary-fixed/20 scale-[1.01]'
              : 'border-outline-variant/70 hover:border-secondary-container bg-surface-container-low/50 hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-2xl text-secondary">upload_file</span>
          <p className="font-headline font-bold text-xs text-on-surface">
            Drag & drop your Resume or <span className="text-secondary underline">Browse File</span>
          </p>
          <span className="text-[10px] font-body text-on-surface-variant">
            Accepts PDF, DOC, DOCX up to 10MB
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
    </div>
  );
};
