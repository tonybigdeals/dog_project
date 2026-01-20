import React, { useState } from 'react';
import { clsx } from 'clsx';

const SortSelector = ({ sortOptions, selectedSort, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = sortOptions.find(opt => opt.id === selectedSort) || sortOptions[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-[#1b120e] dark:text-white"
      >
        <span className="material-symbols-outlined text-base">{selectedOption.icon}</span>
        <span>{selectedOption.name}</span>
        <span className={clsx("material-symbols-outlined text-base transition-transform", isOpen && "rotate-180")}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg z-20 min-w-[140px]">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm transition-colors",
                  selectedSort === option.id
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-[#1b120e] dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
                )}
              >
                <span className="material-symbols-outlined text-base">{option.icon}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortSelector;
