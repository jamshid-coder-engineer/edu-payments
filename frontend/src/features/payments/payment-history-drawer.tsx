import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { formatMoney } from '@/lib/money';
import type { Debtor } from '@/types/api';
import { PaymentHistory } from './payment-history';

interface PaymentHistoryDrawerProps {
  /** null bo'lsa panel yopiq */
  debtor: Debtor | null;
  month: string;
  onClose: () => void;
  onPay: (debtor: Debtor) => void;
}

/** Qarzdor kartochkasidan ochiladigan to'lovlar tarixi. */
export function PaymentHistoryDrawer({
  debtor,
  month,
  onClose,
  onPay,
}: PaymentHistoryDrawerProps) {
  return (
    <Drawer open={debtor !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {debtor && (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 overflow-y-auto px-4 pb-6">
            <DrawerHeader className="px-0">
              <DrawerTitle>{debtor.name}</DrawerTitle>
              <DrawerDescription>
                {debtor.group} · oylik to'lov {formatMoney(debtor.monthlyFee)}
              </DrawerDescription>
            </DrawerHeader>
            <PaymentHistory
              studentId={debtor.studentId}
              monthlyFee={debtor.monthlyFee}
              month={month}
            />
            <Button className="h-11 w-full" onClick={() => onPay(debtor)}>
              <PlusIcon />
              To'lov qo'shish
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
