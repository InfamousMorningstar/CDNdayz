"use client";

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Layers, ListChecks, ShieldCheck } from 'lucide-react';

interface ServerModRecord {
  id: string;
  serverName: string;
  map: string;
  endpoint: string;
  modCount: number | null;
  mods: Array<{
    name: string;
    steamWorkshopId?: string;
  }>;
  source: string;
  lastVerified: string;
  error?: string;
}

export function ServerModsOverview() {
  const [records, setRecords] = useState<ServerModRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRecordId, setOpenRecordId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMods = async () => {
      try {
        const response = await fetch('/api/server-mods');
        if (!response.ok) {
          throw new Error(`Failed to load server mods (${response.status})`);
        }

        const data = (await response.json()) as ServerModRecord[];
        setRecords(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load server mods');
      } finally {
        setLoading(false);
      }
    };

    fetchMods();
    const interval = setInterval(fetchMods, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const verifiedCount = useMemo(
    () => records.filter((record) => record.modCount !== null).length,
    [records]
  );

  const totalModsAcrossServers = useMemo(
    () => records.reduce((sum, record) => sum + (record.modCount ?? 0), 0),
    [records]
  );

  const toggleRecord = (recordId: string) => {
    setOpenRecordId((current) => (current === recordId ? null : recordId));
  };

  return (
    <section aria-labelledby="server-mods-heading" className="mt-12 sm:mt-16">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3 border-red-500/30 text-red-300 bg-red-500/10">
          <Layers className="w-3 h-3 mr-2" />
          Verified Mod Inventory
        </Badge>
        <h2 id="server-mods-heading" className="text-2xl sm:text-3xl md:text-4xl text-white font-heading font-bold mb-3">
          Server <span className="text-red-500">Mods</span>
        </h2>
        <p className="text-neutral-400 max-w-3xl">
          Live launcher data. This section pulls directly from the same DayZSA query source used by launcher server checks, so mod counts and mod names are not hand-written.
        </p>
      </div>

      <Card className="p-4 sm:p-6 bg-neutral-900/50 border-neutral-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 text-white">
          <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
            <h3 className="font-bold tracking-wide uppercase text-sm">Verification Status</h3>
          </div>
          <Badge variant="outline" className="border-white/10 text-neutral-300 bg-white/5">
            {verifiedCount} / {records.length || 12} servers verified
          </Badge>
        </div>

        <div className="mb-4 text-xs text-neutral-500">
          Total mods across verified servers: <span className="text-neutral-300 font-semibold">{totalModsAcrossServers}</span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-lg border border-white/10 bg-black/20 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {records.map((record) => {
            const isVerified = record.modCount !== null;
            const previewMods = record.mods.slice(0, 4);
            const isOpen = openRecordId === record.id;

            return (
              <article
                key={record.id}
                onClick={() => toggleRecord(record.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleRecord(record.id);
                  }
                }}
                className={`rounded-lg border text-left p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 ${
                  isOpen
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-white/10 bg-black/20 hover:border-white/30'
                }`}
                aria-expanded={isOpen}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{record.serverName}</p>
                    <p className="text-neutral-500 text-[11px] uppercase tracking-widest mt-1">{record.map}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      isVerified
                        ? 'border-green-500/30 text-green-300 bg-green-500/10'
                        : 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                    }`}
                  >
                    {isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="text-sm text-neutral-200 mb-1">
                  Mods: <span className="font-bold text-white">{isVerified ? record.modCount : 'Unknown'}</span>
                </div>

                {!isOpen && previewMods.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {previewMods.map((mod) => (
                      <p key={mod.steamWorkshopId || mod.name} className="text-xs text-neutral-400 truncate">
                        {mod.name}
                      </p>
                    ))}
                    {record.mods.length > previewMods.length && (
                      <p className="text-xs text-neutral-500">+{record.mods.length - previewMods.length} more</p>
                    )}
                  </div>
                )}

                {isOpen && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">All mods</p>
                    {record.mods.length === 0 && (
                      <p className="text-xs text-neutral-500">No mod list returned yet for this server.</p>
                    )}
                    {record.mods.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-auto pr-1">
                        {record.mods.map((mod, index) => {
                          const workshopHref = mod.steamWorkshopId
                            ? `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.steamWorkshopId}`
                            : null;

                          return (
                            <div key={`${mod.steamWorkshopId || mod.name}-${index}`} className="rounded border border-white/10 bg-black/30 p-2">
                              <p className="text-xs text-white leading-snug">{mod.name}</p>
                              {mod.steamWorkshopId && (
                                <a
                                  href={workshopHref!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-red-300 hover:text-red-200 transition-colors"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  Workshop ID: {mod.steamWorkshopId}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <p className="text-xs text-neutral-500 mt-3 break-all">Endpoint: {record.endpoint}</p>
                    <p className="text-xs text-neutral-500 mt-1 break-all">Source: {record.source}</p>
                    {record.lastVerified && <p className="text-xs text-neutral-500 mt-1 break-all">Verified: {record.lastVerified}</p>}
                    {record.error && <p className="text-xs text-amber-300 mt-2">{record.error}</p>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
        )}
      </Card>

      <div className="mt-6 flex items-start gap-2 text-neutral-500 text-xs">
        <ListChecks className="w-4 h-4 mt-0.5" />
        <p>
          Data updates every 60 seconds from the DayZSA query endpoint. If a server is unreachable, it is marked pending until the next successful query.
        </p>
      </div>
    </section>
  );
}
