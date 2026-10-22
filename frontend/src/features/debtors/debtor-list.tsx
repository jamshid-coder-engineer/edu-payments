import { AlertCircleIcon, PartyPopperIcon, RotateCwIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMonth } from '@/lib/date';
import type { Debtor } from '@/types/api';
import { DebtSummary } from './debt-summary';
import { DebtorCard } from './debtor-card';
import { useDebtors } from './use-debtors';

interface DebtorListProps {
  month: string;
  onPay: (debtor: Debtor) => void;
  onHistory: (debtor: Debtor) => void;
}

/** Qarzdorlar: yuklanish, xato, bo'sh va to'liq holatlar. */
export function DebtorList({ month, onPay, onHistory }: DebtorListProps) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useDebtors(month);

  if (isPending) {
    return (
      <div
        className="flex flex-col gap-3"
        aria-busy="true"
        aria-label="Yuklanmoqda"
      >
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Ro'yxat yuklanmadi</AlertTitle>
        <AlertDescription>
          <p>{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => refetch()}
          >
            <RotateCwIcon />
            Qayta urinish
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <PartyPopperIcon className="size-6" />
        </span>
        <p className="font-medium">{formatMonth(month)}: qarzdorlar yo'q</p>
        <p className="text-sm text-muted-foreground">
          Hamma o'quvchilar to'liq to'lagan.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
    >
      <DebtSummary debtors={data} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {data.map((debtor) => (
          <li key={debtor.studentId}>
            <DebtorCard debtor={debtor} onPay={onPay} onHistory={onHistory} />
          </li>
        ))}
      </ul>
    </div>
  );
}
