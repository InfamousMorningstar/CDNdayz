import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { DayzErrorCode } from '@/data/dayzErrorCodes';

type Status = DayzErrorCode['status'];

const statusMeta: Record<Status, { label: string; className: string }> = {
  documented: {
    label: 'Documented',
    className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
  },
  partially_documented: {
    label: 'Partially Documented',
    className: 'border-amber-500/25 bg-amber-500/10 text-amber-300'
  },
  inferred: {
    label: 'Inferred',
    className: 'border-sky-500/25 bg-sky-500/10 text-sky-300'
  }
};

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = statusMeta[status];

  return (
    <Badge
      variant="outline"
      className={cn('font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase', meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}

export const statusBadgeMeta = statusMeta;