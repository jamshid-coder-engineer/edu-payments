import { BanknoteIcon, UsersIcon, type LucideIcon } from 'lucide-react';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { Debtor } from '@/types/api';
import { debtStatus } from './debt-status';

/** Oy bo'yicha qisqa natija: nechta qarzdor (holat bo'yicha) va jami qarz. */
export function DebtSummary({ debtors }: { debtors: Debtor[] }) {
  const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);
  const partial = debtors.filter((d) => debtStatus(d) === 'partial').length;
  const unpaid = debtors.length - partial;
  const largest = Math.max(...debtors.map((d) => d.debt));

  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryTile
        icon={UsersIcon}
        iconClass="bg-primary/10 text-primary"
        label="Qarzdorlar"
        value={`${debtors.length} ta`}
        hint={`${unpaid} to'lamagan · ${partial} qisman`}
      />
      <SummaryTile
        icon={BanknoteIcon}
        iconClass="bg-destructive/10 text-destructive"
        label="Jami qarz"
        value={formatMoney(totalDebt)}
        hint={`Eng kattasi: ${formatMoney(largest)}`}
      />
    </div>
  );
}

interface SummaryTileProps {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  value: string;
  hint: string;
}

function SummaryTile({
  icon: Icon,
  iconClass,
  label,
  value,
  hint,
}: SummaryTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-card p-3 shadow-xs ring-1 ring-foreground/10 sm:p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-lg',
            iconClass,
          )}
        >
          <Icon className="size-4" />
        </span>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
      <p className="text-lg font-medium tabular-nums sm:text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
