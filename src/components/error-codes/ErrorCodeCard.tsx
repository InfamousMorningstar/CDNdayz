import { Card } from '@/components/ui/Card';
import { DayzErrorCode } from '@/data/dayzErrorCodes';
import { StatusBadge } from '@/components/error-codes/StatusBadge';
import { DayzErrorReference } from '@/data/dayzErrorReferences';

type ErrorCodeCardProps = {
  item: DayzErrorCode;
  references: DayzErrorReference[];
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-neutral-500 font-mono">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((entry) => (
          <li key={entry} className="flex items-start gap-2 text-sm text-neutral-300 leading-relaxed">
            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/80" />
            <span>{entry}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErrorCodeCard({ item, references }: ErrorCodeCardProps) {
  return (
    <Card
      variant="outline"
      className="group rounded-2xl border-white/10 bg-black/35 p-5 sm:p-6 hover:border-red-500/30 hover:bg-black/45"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="font-mono text-red-300 text-base sm:text-lg tracking-wider">{item.code}</p>
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-white leading-tight">{item.title}</h3>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">{item.description}</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <DetailList title="Common Causes" items={item.commonCauses} />
        <DetailList title="Recommended Fixes" items={item.recommendedFixes} />
      </div>

      {references.length > 0 ? (
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-neutral-500 font-mono mb-2">Sources</p>
          <div className="flex flex-wrap gap-2">
            {references.map((reference) => (
              <a
                key={reference.id}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-neutral-300 hover:border-red-500/40 hover:text-red-200 transition-colors"
              >
                {reference.id}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}