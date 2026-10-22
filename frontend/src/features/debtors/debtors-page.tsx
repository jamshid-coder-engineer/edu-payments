import { PlusIcon, WalletIcon } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import type { PaymentFormDefaults } from '@/features/payments/payment-form';
import { currentMonth, defaultPaymentDate } from '@/lib/date';
import type { Debtor } from '@/types/api';
import { DebtorList } from './debtor-list';
import { MonthSwitcher } from './month-switcher';

// Panellar (forma, zod, drawer) alohida bo'lak: birinchi ekran tezroq ochiladi
const loadPaymentDrawer = () => import('@/features/payments/payment-drawer');
const loadHistoryDrawer = () =>
  import('@/features/payments/payment-history-drawer');
const PaymentDrawer = lazy(() =>
  loadPaymentDrawer().then((m) => ({ default: m.PaymentDrawer })),
);
const PaymentHistoryDrawer = lazy(() =>
  loadHistoryDrawer().then((m) => ({ default: m.PaymentHistoryDrawer })),
);

export function DebtorsPage() {
  const [month, setMonth] = useState(currentMonth);
  const [payment, setPayment] = useState<PaymentFormDefaults | null>(null);
  const [history, setHistory] = useState<Debtor | null>(null);

  // Sahifa ochilgach panellar kodini fonda yuklab qo'yamiz: tugma bosilganda kutish bo'lmaydi
  useEffect(() => {
    void loadPaymentDrawer();
    void loadHistoryDrawer();
  }, []);

  // Kartochkadan yoki tarixdan: o'quvchi va qarz summasi oldindan to'ldiriladi
  const payFor = (debtor: Debtor) => {
    setHistory(null);
    setPayment({
      studentId: debtor.studentId,
      amount: debtor.debt,
      paidAt: defaultPaymentDate(month),
    });
  };

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <WalletIcon className="size-5" />
            </span>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-lg font-semibold">Qarzdorlar</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                O'quv markazi to'lovlari
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              className="h-10"
              aria-label="To'lov qo'shish"
              onClick={() => setPayment({ paidAt: defaultPaymentDate(month) })}
            >
              <PlusIcon />
              <span className="sm:hidden">To'lov</span>
              <span className="hidden sm:inline">To'lov qo'shish</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:py-6">
        <MonthSwitcher month={month} onChange={setMonth} />
        <DebtorList month={month} onPay={payFor} onHistory={setHistory} />
      </main>
      <Suspense fallback={null}>
        <PaymentDrawer defaults={payment} onClose={() => setPayment(null)} />
        <PaymentHistoryDrawer
          debtor={history}
          month={month}
          onClose={() => setHistory(null)}
          onPay={payFor}
        />
      </Suspense>
    </div>
  );
}
