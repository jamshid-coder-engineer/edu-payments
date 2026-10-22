import { HistoryIcon, PhoneIcon, PlusIcon } from 'lucide-react';
import { InitialsAvatar } from '@/components/initials-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMoney, paidPercent } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { Debtor } from '@/types/api';
import { debtStatus, STATUS_STYLE } from './debt-status';

interface DebtorCardProps {
  debtor: Debtor;
  onPay: (debtor: Debtor) => void;
  onHistory: (debtor: Debtor) => void;
}

export function DebtorCard({ debtor, onPay, onHistory }: DebtorCardProps) {
  const percent = paidPercent(debtor.paid, debtor.monthlyFee);
  const status = STATUS_STYLE[debtStatus(debtor)];

  return (
    <Card className="relative h-full gap-0 py-4 shadow-xs transition-shadow hover:shadow-md">
      {/* Chap chetdagi rang chizig'i: holatni bir qarashda ko'rsatadi */}
      <span
        aria-hidden="true"
        className={cn('absolute inset-y-0 left-0 w-1', status.accent)}
      />
      <CardContent className="flex h-full flex-col gap-4 px-4 pl-5">
        <div className="flex items-start gap-3">
          <InitialsAvatar name={debtor.name} colorKey={debtor.studentId} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate font-semibold">{debtor.name}</p>
              <Badge className={cn('shrink-0', status.badge)}>
                {status.label}
              </Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              <span>{debtor.group}</span>
              <span aria-hidden="true">·</span>
              <a
                href={`tel:${debtor.phone}`}
                className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
              >
                <PhoneIcon className="size-3.5" />
                {debtor.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>
              To'langan {formatMoney(debtor.paid)} /{' '}
              {formatMoney(debtor.monthlyFee)}
            </span>
            <span>{percent}%</span>
          </div>
          <Progress
            value={percent}
            aria-label={`${percent}% to'langan`}
            className={cn('h-1.5', status.progress)}
          />
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Qarz</p>
            <p className="text-lg font-semibold whitespace-nowrap tabular-nums text-destructive">
              {formatMoney(debtor.debt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10"
              aria-label={`${debtor.name}: to'lovlar tarixi`}
              onClick={() => onHistory(debtor)}
            >
              <HistoryIcon />
              Tarix
            </Button>
            <Button className="h-10" onClick={() => onPay(debtor)}>
              <PlusIcon />
              To'lov
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
