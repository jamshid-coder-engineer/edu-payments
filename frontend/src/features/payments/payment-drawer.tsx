import { toast } from 'sonner';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { formatDate } from '@/lib/date';
import { formatMoney } from '@/lib/money';
import { PaymentForm, type PaymentFormDefaults } from './payment-form';

interface PaymentDrawerProps {
  /** null bo'lsa panel yopiq */
  defaults: PaymentFormDefaults | null;
  onClose: () => void;
}

/** Telefonda pastdan chiqadigan to'lov paneli. */
export function PaymentDrawer({ defaults, onClose }: PaymentDrawerProps) {
  return (
    <Drawer
      open={defaults !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-md overflow-y-auto px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>To'lov qo'shish</DrawerTitle>
            <DrawerDescription>
              Saqlangach qarzdorlar ro'yxati o'zi yangilanadi.
            </DrawerDescription>
          </DrawerHeader>
          {defaults && (
            <PaymentForm
              // Har ochilishda forma yangidan boshlanadi
              key={JSON.stringify(defaults)}
              defaults={defaults}
              onSuccess={(payment) => {
                toast.success(
                  `To'lov saqlandi: ${formatMoney(payment.amount)}`,
                  {
                    description: formatDate(payment.paidAt),
                  },
                );
                onClose();
              }}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
