import React, { useState, useRef } from 'react';

const CARTOON_AVATAR_OPTIONS = [
  { label: 'Tony Stark (AI/Robotics)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4RzXU2GB04GCYx9u-TAoQ9_9GsyWxjre7V_Ertq0_p93iiSYG-iozkIkbstlXtOj5ZYh5A4Yp1Zz9wWMwQWY-TN-Xz7cAmNQn9id5bRxq-DSApX3vpHAgq9FTzKifpPLdMyV0gfCPoR3CsTo4_bJJV7D_dihVsDTRPtaxRdmhu8614Cmf9jTuw9eVK8f6H9ziOdRZ4bJ3ZNDENmlebsWz7xI35GPkGdoRt-9-H_MwBu2EG01fTwpT' },
  { label: 'Shuri (Biotech/Research)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyfXTIBvf2-HDDh7lWifR42qsLcGBD2Q5PEMnXBbdp2MU7VfKZ4Nygx5Y7WrmmfWZBZSV3vzTsJ8uKuN1u3_hAk9czScfULGlASGlxdG_LSVbOHjsbOYeCBHNkEGSj7x8Ii2Kk5Dtkt4nK5yoV9Z7yxYKRxAGT86nc1zyUxJRarMggSCwXQJhREOG3jIf29wSKbu2vFyabR0X0ElzYrVfU6rh4Fe09lce3oFHSZQLLYPDVoQMdPCWz' },
  { label: 'Peter Parker (Vision)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIAEM0CmncmJFyu0d0iJUC33DhPTtnS5wovf_yHctEWhWzTKMTMSGIiDoCPIpcEMYVk7V0zm1z9ytOnFN8ZoILMfK-zIydqW8A8iqRoeUEyryUh-KA2Rhpb_AqBAVnyQ5iYuiFixWXTYk5F4efglYeDPoqoca_u19ylN9SjTu85YkMK-CCYKFpNZRr7bPgmtK2-pnimLtloPIIL3Ghdv51Q72cELzSoH7g3B8l6lu7idI602KENScV' },
  { label: 'Hermione (Data Science)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlUaDi8M5Ypywmk66BS1QQFHZeKlGfgJzUYF2XrOp2AvitIECXu4jfb43NiG5hq5138igY0iU-kTjM5wXJ-TOklcn7VVODT39dc3YmfBs8tcGJ8EgH4eprL-l-Ye0rL0v0xxa15RpS9SkPAmbkLKgwhDzxLCokZ84kxz8LT1wETSfBFmNqrIUCeAqa2BIYpCjbOQX1hvZIeBUi6XgNv1nCSqO6sf1eZ4TLDMHN2wsbx6liH3StwGZC' },
  { label: 'Wednesday (Security)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA51i-Dxe6HXaGas_hRburQJ7Q90acBv0bp2cmUZYOX8lA75h4Z8g18g5bqynobuCvDogvvsZa_P5LeVS7K50EH3HCzSZlgtrNe94RQb6zboa-G_uAa0F7nUZruS3Ci9fEcop7odHAQsQi7nbd4YH30OY8EmXly3Cl27tZGF6qatKh7J_VC-L6DQouinBvDpTc0TepJ3rndjyu7hHy51ZB6fcPUCIOSuBi2cTkA11jV_25_yoXoVIMc' },
  { label: 'Barbie (UX/Design)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WIpwt9af-h2O_waK-V2JWa4mE0FdIstBdzyr5a2V_oJ9O3cHvMeC5pa9WZJK2XzWMELvohzB256nMabl2362_0-zIbpK_6wzzAFLUH34AYq3TeELZ3CfbdRSlWsnnP3GdEomH5Mf7rVW4Qrf0-yisweD-rRfYmSWGSSTwNgK8029CVcKL9Yy-w-v7z6MZi-Gt7TI_JUCuN3a-rRmVykQjlLm50yOBnUYs7HMMvXzB7ZomOM5YYI_' },
  { label: 'Shrek (Environment)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBC9H4GsmY7quvFdyvNJsCjU3NH9U1fR30xgUp7wPoEDnBHkcO4uXZLQAhYB_4aoqQAH4WrSXneNSq0PwLhP5x4Vs39HLgHiuq_ZtXA0hTmveOZtB1_LgCBHWICJPANWl05qTXtw2R9_3VcIu5G3-5yn_cNsTTReGUs0P_6eb_OWHDGqbmh1DhsT6f9RFrFZXp8vv4YdTXQ_LrUUEolISKrrjHBqoAoVmgGz2AX1CW5idTI9ODCg6A' },
  { label: 'Gru (Distributed Backend)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgamFpNFORKxI7a7zfxUvEuGmjyCttK-Ql7mrJthpNrDydn6BgBcWfMnBbncVq0qR-w9ilRs9V9oJgfB5ZYXPcH0kbMtGuKw2-AYbyd3ivq3ZWhue0MaEMu7JVad9G97UJHmOKxyh8J-MYih0AbaYgKoZeHq9lRutgx9wl5mZGQ3fpYTLypGxXh2sUmWNabR0zts1MLZDe1t7p3MwL8AyQ33zUr-F9UxoKPXRGQ1o_oc96h7OrdKIh' }
];

interface ImageUploadProps {
  profileImage?: string;
  avatar?: string;
  onProfileImageChange: (imageUri: string | undefined) => void;
  onAvatarChange: (avatarUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  profileImage,
  avatar,
  onProfileImageChange,
  onAvatarChange
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'cartoon'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      alert('Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onProfileImageChange(e.target.result as string);
      }
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
    <div className="space-y-4">
      {/* Mode Switcher Pills */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-headline font-bold text-on-surface uppercase tracking-wider">
          Profile Photo & Identity
        </label>
        <div className="flex gap-1 p-1 rounded-xl bg-surface-container border border-outline-variant/40 text-[11px] font-headline font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMode === 'upload'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            📷 Upload Real Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('cartoon')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMode === 'cartoon'
                ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🎨 Choose Cartoon (Demo)
          </button>
        </div>
      </div>

      {activeMode === 'upload' ? (
        <div>
          {profileImage ? (
            /* Uploaded Image Preview Box */
            <div className="p-4 rounded-3xl glass-panel border border-primary-container/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary-container shadow-soft flex-shrink-0 bg-surface">
                  <img
                    src={profileImage}
                    alt="Uploaded Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-headline font-bold mb-1">
                    ✓ Custom Photo Attached
                  </span>
                  <p className="text-xs font-headline font-bold text-on-surface">
                    Real Profile Photo Active
                  </p>
                  <p className="text-[11px] font-body text-on-surface-variant">
                    Displayed across recommendations and cards.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 font-headline text-xs font-bold">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-variant border border-outline-variant text-on-surface transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onProfileImageChange(undefined)}
                  className="px-3.5 py-1.5 rounded-xl bg-error-container/40 hover:bg-error-container text-error transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-primary bg-primary-fixed/20 scale-[1.01]'
                  : 'border-outline-variant/70 hover:border-primary-container bg-surface-container-low/50 hover:bg-surface-container'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-on-surface">
                  Drag & Drop or <span className="text-primary underline">Browse File</span>
                </p>
                <p className="text-xs font-body text-on-surface-variant mt-0.5">
                  Accepts JPG, PNG, WEBP (Max 5MB). Your real photo will be stored in your student record.
                </p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>
      ) : (
        /* Cartoon Avatars Grid */
        <div className="space-y-2">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CARTOON_AVATAR_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onAvatarChange(opt.url);
                  // Clear custom photo if switching to cartoon
                  onProfileImageChange(undefined);
                }}
                className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${
                  avatar === opt.url && !profileImage
                    ? 'border-primary shadow-lg ring-2 ring-primary-container'
                    : 'border-outline-variant opacity-70 hover:opacity-100'
                }`}
                title={opt.label}
              >
                <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <span className="text-[10px] font-headline text-on-surface-variant block text-right">
            ✦ SYNTHETIC DEMO PERSONA AVATARS
          </span>
        </div>
      )}
    </div>
  );
};
