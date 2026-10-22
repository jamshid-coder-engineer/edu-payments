import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, renderWithQuery } from '@/test/utils';
import { PaymentHistory } from '../payment-history';

const payments = [
  { id: 3, studentId: 1, amount: 150_000, paidAt: '2026-10-05' },
  { id: 2, studentId: 1, amount: 400_000, paidAt: '2026-09-20' },
  { id: 1, studentId: 1, amount: 200_000, paidAt: '2026-09-03' },
];

describe('PaymentHistory', () => {
  it("to'lovlarni oylar bo'yicha, qarz yoki to'liq holati bilan ko'rsatadi", async () => {
    const fetchMock = mockApi({
      'GET /students/1/payments': () => Response.json(payments),
    });
    renderWithQuery(
      <PaymentHistory studentId={1} monthlyFee={600_000} month="2026-10" />,
    );

    const october = await screen.findByRole('region', { name: 'Oktabr 2026' });
    expect(within(october).getByText("Qarz 450 000 so'm")).toBeInTheDocument();
    expect(within(october).getByText('5-oktabr 2026')).toBeInTheDocument();

    const september = screen.getByRole('region', { name: 'Sentabr 2026' });
    expect(within(september).getAllByRole('listitem')).toHaveLength(2);
    expect(
      within(september).getByText("To'langan 600 000 so'm"),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/students/1/payments',
      expect.anything(),
    );
  });

  it("to'lov bo'lmasa bo'sh holat", async () => {
    mockApi({ 'GET /students/1/payments': () => Response.json([]) });
    renderWithQuery(
      <PaymentHistory studentId={1} monthlyFee={600_000} month="2026-10" />,
    );

    expect(await screen.findByText("Hali to'lov yo'q")).toBeInTheDocument();
  });

  it('xatodan keyin qayta urinish ishlaydi', async () => {
    let calls = 0;
    mockApi({
      'GET /students/1/payments': () =>
        ++calls === 1
          ? Response.json({ message: "O'quvchi topilmadi" }, { status: 404 })
          : Response.json(payments),
    });
    renderWithQuery(
      <PaymentHistory studentId={1} monthlyFee={600_000} month="2026-10" />,
    );

    expect(await screen.findByText("O'quvchi topilmadi")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /Qayta urinish/ }),
    );
    expect(
      await screen.findByRole('region', { name: 'Oktabr 2026' }),
    ).toBeInTheDocument();
  });

  it("tanlangan oyda to'lov bo'lmasa ham uni to'liq qarz bilan ko'rsatadi", async () => {
    mockApi({
      'GET /students/1/payments': () => Response.json(payments.slice(1)),
    });
    renderWithQuery(
      <PaymentHistory studentId={1} monthlyFee={600_000} month="2026-10" />,
    );

    const october = await screen.findByRole('region', { name: 'Oktabr 2026' });
    expect(within(october).getByText("Qarz 600 000 so'm")).toBeInTheDocument();
    expect(
      within(october).getByText("Bu oyda to'lov yo'q"),
    ).toBeInTheDocument();
  });
});
