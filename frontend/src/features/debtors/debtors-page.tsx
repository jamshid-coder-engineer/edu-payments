import { PlusIcon, WalletIcon } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PaymentFormDefaults } from '@/features/payments/payment-form';
import { currentMonth, defaultPaymentDate } from '@/lib/date';
import type { Debtor } from '@/types/api';
import { DebtorList } from './debtor-list';
import { MonthSwitcher } from './month-switcher';

// To'lov paneli (forma, zod, drawer) alohida bo'lak: birinchi ekran tezroq ochiladi
const loadPaymentDrawer = () => import('@/features/payments/payment-drawer');
const PaymentDrawer = lazy(() =>
  loadPaymentDrawer().then((m) => ({ default: m.PaymentDrawer })),
);

export function DebtorsPage() {
  const [month, setMonth] = useState(currentMonth);
  const [payment, setPayment] = useState<PaymentFormDefaults | null>(null);

  // Sahifa ochilgach panel kodini fonda yuklab qo'yamiz: tugma bosilganda kutish bo'lmaydi
  useEffect(() => {
    void loadPaymentDrawer();
  }, []);

  // Qarzdor kartochkasidan: o'quvchi va qarz summasi oldindan to'ldiriladi
  const payFor = (debtor: Debtor) =>
    setPayment({
      studentId: debtor.studentId,
      amount: debtor.debt,
      paidAt: defaultPaymentDate(month),
    });

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WalletIcon className="size-6" />
          <h1 className="text-xl font-semibold">Qarzdorlar</h1>
        </div>
        <Button
          className="h-10"
          onClick={() => setPayment({ paidAt: defaultPaymentDate(month) })}
        >
          <PlusIcon />
          To'lov qo'shish
        </Button>
      </header>

      <MonthSwitcher month={month} onChange={setMonth} />
      <DebtorList month={month} onPay={payFor} />
      <Suspense fallback={null}>
        <PaymentDrawer defaults={payment} onClose={() => setPayment(null)} />
      </Suspense>
    </div>
  );
}
