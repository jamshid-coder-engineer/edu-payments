import { PhoneIcon, PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/lib/money';
import type { Debtor } from '@/types/api';

interface DebtorCardProps {
  debtor: Debtor;
  onPay: (debtor: Debtor) => void;
}

export function DebtorCard({ debtor, onPay }: DebtorCardProps) {
  const paidPercent = Math.round((debtor.paid / debtor.monthlyFee) * 100);

  return (
    <Card className="gap-0 py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{debtor.name}</p>
            <a
              href={`tel:${debtor.phone}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
            >
              <PhoneIcon className="size-3.5" />
              {debtor.phone}
            </a>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {debtor.group}
          </Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <Progress
            value={paidPercent}
            aria-label={`${paidPercent}% to'langan`}
          />
          <p className="text-xs text-muted-foreground tabular-nums">
            To'langan {formatMoney(debtor.paid)} /{' '}
            {formatMoney(debtor.monthlyFee)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Qarz</p>
            <p className="text-lg font-semibold tabular-nums text-destructive">
              {formatMoney(debtor.debt)}
            </p>
          </div>
          <Button className="h-10" onClick={() => onPay(debtor)}>
            <PlusIcon />
            To'lov
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
