"use client";

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type ErrorCodeFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function ErrorCodeFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchValue,
  onSearchChange
}: ErrorCodeFiltersProps) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by code, title, or description"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-11 py-3.5 text-sm sm:text-base text-neutral-100 placeholder:text-neutral-500 transition-colors focus:border-red-500/40 focus:outline-none"
          aria-label="Search DayZ error codes"
        />
        {searchValue ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-neutral-500 transition-colors hover:text-neutral-200"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <Button
              key={category}
              type="button"
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.14em] transition-all',
                isActive
                  ? 'border-red-500/60 bg-red-500/15 text-red-200 shadow-[0_0_18px_rgba(220,38,38,0.25)]'
                  : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-red-500/35 hover:text-red-200'
              )}
            >
              {category}
            </Button>
          );
        })}
      </div>
    </section>
  );
}