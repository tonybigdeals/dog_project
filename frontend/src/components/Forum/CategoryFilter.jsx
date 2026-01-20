import React from 'react';
import { clsx } from 'clsx';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
            selectedCategory === category.id
              ? "bg-primary text-white"
              : "bg-white dark:bg-zinc-800 text-warm-beige border border-zinc-200 dark:border-zinc-700"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
