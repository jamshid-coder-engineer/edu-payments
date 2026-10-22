import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { todayIso } from '@/lib/date';
import { students } from '@/test/fixtures';
import { mockApi, renderWithQuery } from '@/test/utils';
import { PaymentForm } from '../payment-form';

const today = todayIso();
const save = () =>
  userEvent.click(screen.getByRole('button', { name: "To'lovni saqlash" }));

describe('PaymentForm', () => {
  it("bo'sh formani yubormaydi va xatolarni ko'rsatadi", async () => {
    const fetchMock = mockApi({
      'GET /students': () => Response.json(students),
    });
    renderWithQuery(
      <PaymentForm defaults={{ paidAt: today }} onSuccess={vi.fn()} />,
    );

    await save();

    expect(await screen.findByText('Summani kiriting')).toBeInTheDocument();
    // Biri tanlagichdagi yozuv, ikkinchisi xato xabari
    expect(screen.getAllByText("O'quvchini tanlang")).toHaveLength(2);
    const posts = fetchMock.mock.calls.filter(([, init]) => init?.method);
    expect(posts).toHaveLength(0);
  });

  it('summani yozish jarayonida guruhlaydi', async () => {
    mockApi({ 'GET /students': () => Response.json(students) });
    renderWithQuery(
      <PaymentForm defaults={{ paidAt: today }} onSuccess={vi.fn()} />,
    );

    const amount = screen.getByLabelText("Summa, so'm");
    await userEvent.type(amount, '1250000');
    expect(amount).toHaveValue('1 250 000');
  });

  it('100 mln dan katta summani rad etadi', async () => {
    mockApi({ 'GET /students': () => Response.json(students) });
    renderWithQuery(
      <PaymentForm
        defaults={{ studentId: 1, amount: 100_000_001, paidAt: today }}
        onSuccess={vi.fn()}
      />,
    );

    await save();
    expect(
      await screen.findByText("Summa juda katta (100 mln so'mgacha)"),
    ).toBeInTheDocument();
  });

  it("to'g'ri ma'lumotni backendga yuboradi", async () => {
    const created = { id: 7, studentId: 1, amount: 450_000, paidAt: today };
    const fetchMock = mockApi({
      'GET /students': () => Response.json(students),
      'POST /payments': () => Response.json(created, { status: 201 }),
    });
    const onSuccess = vi.fn();
    renderWithQuery(
      <PaymentForm
        defaults={{ studentId: 1, amount: 450_000, paidAt: today }}
        onSuccess={onSuccess}
      />,
    );

    expect(
      await screen.findByText('Ali Valiyev · Frontend-1'),
    ).toBeInTheDocument();
    await save();

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(onSuccess.mock.calls[0][0]).toEqual(created);
    const [, init] = fetchMock.mock.calls.find(([, i]) => i?.method)!;
    expect(JSON.parse(String(init?.body))).toEqual({
      studentId: 1,
      amount: 450_000,
      paidAt: today,
    });
  });

  it("backend rad etsa uning xabarini formada ko'rsatadi", async () => {
    const message = "To'lov sanasi o'quvchi qo'shilgan sanadan oldin";
    mockApi({
      'GET /students': () => Response.json(students),
      'POST /payments': () =>
        Response.json({ message: [message] }, { status: 400 }),
    });
    const onSuccess = vi.fn();
    renderWithQuery(
      <PaymentForm
        defaults={{ studentId: 1, amount: 450_000, paidAt: today }}
        onSuccess={onSuccess}
      />,
    );

    await save();
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("o'quvchilar yuklanmasa sababini aytadi va qayta urinish beradi", async () => {
    let calls = 0;
    mockApi({
      'GET /students': () => {
        calls += 1;
        if (calls === 1) throw new TypeError('Failed to fetch');
        return Response.json(students);
      },
    });
    renderWithQuery(
      <PaymentForm
        defaults={{ studentId: 1, paidAt: today }}
        onSuccess={vi.fn()}
      />,
    );

    expect(
      await screen.findByText(/Server bilan aloqa yo'q/),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Qayta urinish' }),
    );
    expect(
      await screen.findByText('Ali Valiyev · Frontend-1'),
    ).toBeInTheDocument();
  });
});
