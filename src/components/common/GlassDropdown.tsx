import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  sublabel?: string;
}

interface GlassDropdownProps {
  label?: string;
  value: string;
  options: (string | DropdownOption)[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select option...',
  searchable = false,
  icon,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const normalizedOptions: DropdownOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  // Filter options if searchable
  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl glass-input text-left font-body text-sm text-on-surface transition-all duration-200 ${
          isOpen ? 'ring-2 ring-primary-container border-primary-container shadow-soft' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-container/60'}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {icon && (
            <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">
              {icon}
            </span>
          )}
          {selectedOption?.icon && (
            <span className="material-symbols-outlined text-secondary text-lg flex-shrink-0">
              {selectedOption.icon}
            </span>
          )}
          <span className={`truncate ${!selectedOption ? 'text-on-surface-variant/60' : 'font-semibold'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <span
          className={`material-symbols-outlined text-on-surface-variant text-lg transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Floating Glass Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 glass-dropdown rounded-2xl p-2 max-h-64 overflow-y-auto animate-fadeIn shadow-2xl">
          {searchable && (
            <div className="p-1.5 mb-1.5 border-b border-outline-variant/30">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter options..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface dark:bg-surface-container text-xs font-body border border-outline-variant/40 focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs font-body text-on-surface-variant">
                No matching options found
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-body text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-soft'
                        : 'text-on-surface hover:bg-surface-variant/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && (
                        <span className="material-symbols-outlined text-sm flex-shrink-0">
                          {opt.icon}
                        </span>
                      )}
                      <div>
                        <span className="block truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className={`block text-[10px] opacity-75 truncate ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-bold flex-shrink-0">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
