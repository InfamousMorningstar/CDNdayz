"use client";

import { useMemo, useState } from 'react';
import { AlertTriangle, FileWarning, SearchX } from 'lucide-react';
import { dayzErrorCodes } from '@/data/dayzErrorCodes';
import { dayzErrorReferences, DayzErrorReference } from '@/data/dayzErrorReferences';
import { Card } from '@/components/ui/Card';
import { ErrorCodeFilters } from '@/components/error-codes/ErrorCodeFilters';
import { ErrorCodeCard } from '@/components/error-codes/ErrorCodeCard';
import { StatusBadge } from '@/components/error-codes/StatusBadge';

const ALL_CATEGORIES = 'All Categories';

export function DayzErrorCodesClient() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...new Set(dayzErrorCodes.map((entry) => entry.category))],
    []
  );

  const filteredCodes = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return dayzErrorCodes.filter((entry) => {
      const inCategory = selectedCategory === ALL_CATEGORIES || entry.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        entry.code.toLowerCase().includes(normalizedSearch) ||
        entry.title.toLowerCase().includes(normalizedSearch) ||
        entry.description.toLowerCase().includes(normalizedSearch);

      return inCategory && matchesSearch;
    });
  }, [searchValue, selectedCategory]);

  const groupedResults = useMemo(() => {
    return filteredCodes.reduce<Record<string, typeof dayzErrorCodes>>((accumulator, entry) => {
      if (!accumulator[entry.category]) {
        accumulator[entry.category] = [];
      }

      accumulator[entry.category].push(entry);
      return accumulator;
    }, {});
  }, [filteredCodes]);

  const groupedEntries = Object.entries(groupedResults).sort(([categoryA], [categoryB]) =>
    categoryA.localeCompare(categoryB)
  );

  const referencesById = useMemo(() => {
    return dayzErrorReferences.reduce<Record<string, DayzErrorReference>>((accumulator, reference) => {
      accumulator[reference.id] = reference;
      return accumulator;
    }, {});
  }, []);

  const usedReferenceIds = useMemo(() => {
    const ids = new Set<string>();
    dayzErrorCodes.forEach((entry) => {
      entry.sourceIds.forEach((sourceId) => ids.add(sourceId));
    });

    return Array.from(ids).sort();
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      <Card className="rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-900/25 via-black/40 to-black/40 p-5 sm:p-7">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-300 shrink-0">
              <FileWarning size={18} />
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white">Documentation Disclaimer</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              This is not a complete list of every DayZ warning/error code. Finding and validating all codes is difficult, so this hub currently includes the most reliable entries I could verify so far. Official documentation does not publish an exact root-cause tree for every code path, so this page combines official code naming with support guidance and reproducible community evidence and will be expanded as more codes are discovered and confirmed.
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="documented" />
              <StatusBadge status="partially_documented" />
              <StatusBadge status="inferred" />
            </div>
          </div>
        </div>
      </Card>

      <ErrorCodeFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {groupedEntries.length === 0 ? (
        <Card className="rounded-2xl border border-white/10 bg-black/35 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300">
            <SearchX size={20} />
          </div>
          <h3 className="text-xl font-heading text-white">No matching error codes</h3>
          <p className="mt-2 text-neutral-400 text-sm sm:text-base">
            Try a different code, title keyword, or reset your active category filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedEntries.map(([category, entries]) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white">{category}</h2>
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-neutral-500">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {entries.map((item) => (
                  <ErrorCodeCard
                    key={item.code}
                    item={item}
                    references={item.sourceIds
                      .map((sourceId) => referencesById[sourceId])
                      .filter((reference): reference is DayzErrorReference => Boolean(reference))}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Card className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-7">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white">References</h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Source IDs shown in each code card map to the documents below.
          </p>

          <div className="space-y-3">
            {usedReferenceIds.map((referenceId) => {
              const reference = referencesById[referenceId];
              if (!reference) return null;

              return (
                <div key={reference.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-red-300">{reference.id}</span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-neutral-500">{reference.type.replace('_', ' ')}</span>
                  </div>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm sm:text-base text-neutral-100 hover:text-red-200 transition-colors"
                  >
                    {reference.title}
                  </a>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-400">{reference.note}</p>
                  {reference.evidenceQuotes.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {reference.evidenceQuotes.map((quote) => (
                        <blockquote
                          key={quote}
                          className="border-l-2 border-red-500/40 pl-3 text-xs sm:text-sm text-neutral-300/90 italic"
                        >
                          {quote}
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-300">
            <AlertTriangle size={18} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white">Unknown code?</h2>
            <ul className="space-y-2 text-sm sm:text-base text-neutral-300 leading-relaxed">
              <li>Verify game files through Steam and restart your PC.</li>
              <li>Move DayZ to an SSD if possible and close heavy background apps.</li>
              <li>Try joining a different server to identify whether the issue is server-specific.</li>
              <li>Recheck your mods and load order if you play on modded servers.</li>
              <li>Share the exact code and context with staff in Discord support for targeted help.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}