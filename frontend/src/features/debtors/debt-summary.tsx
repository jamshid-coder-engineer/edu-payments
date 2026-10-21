import { formatMoney } from '@/lib/money';
import type { Debtor } from '@/types/api';

/** Oy bo'yicha qisqa natija: nechta qarzdor va jami qarz. */
export function DebtSummary({ debtors }: { debtors: Debtor[] }) {
  const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border bg-card p-3">
        <p className="text-sm text-muted-foreground">Qarzdorlar</p>
        <p className="text-xl font-semibold tabular-nums">
          {debtors.length} ta
        </p>
      </div>
      <div className="rounded-lg border bg-card p-3">
        <p className="text-sm text-muted-foreground">Jami qarz</p>
        <p className="text-xl font-semibold tabular-nums text-destructive">
          {formatMoney(totalDebt)}
        </p>
      </div>
    </div>
  );
}
