import { AlertCircleIcon, ReceiptIcon, RotateCwIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatMonth } from '@/lib/date';
import { formatMoney } from '@/lib/money';
import { groupByMonth, withMonth } from './group-by-month';
import { useStudentPayments } from './use-student-payments';

interface PaymentHistoryProps {
  studentId: number;
  monthlyFee: number;
  /** Sahifada tanlangan oy: to'lov bo'lmasa ham ro'yxatda turadi */
  month: string;
}

/** O'quvchi to'lovlari oylar bo'yicha: har oyda jami va oylik to'lovga nisbatan holat. */
export function PaymentHistory({
  studentId,
  monthlyFee,
  month,
}: PaymentHistoryProps) {
  const { data, isPending, isError, error, refetch } =
    useStudentPayments(studentId);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
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
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center">
        <ReceiptIcon className="size-7 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Hali to'lov yo'q</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {withMonth(groupByMonth(data), month).map((group) => {
        const debt = monthlyFee - group.total;
        return (
          <section key={group.month} aria-label={formatMonth(group.month)}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <h3 className="font-medium">{formatMonth(group.month)}</h3>
              <p
                className={`text-xs tabular-nums ${debt > 0 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {debt > 0
                  ? `Qarz ${formatMoney(debt)}`
                  : `To'langan ${formatMoney(group.total)}`}
              </p>
            </div>
            {group.payments.length === 0 ? (
              <p className="rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
                Bu oyda to'lov yo'q
              </p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {group.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {formatDate(payment.paidAt)}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
