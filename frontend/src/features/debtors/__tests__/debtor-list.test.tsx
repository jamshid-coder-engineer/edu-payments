import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { debtors } from '@/test/fixtures';
import { mockApi, renderWithQuery } from '@/test/utils';
import { DebtorList } from '../debtor-list';

describe('DebtorList', () => {
  it("qarzdorlar, ularning soni va jami qarzni ko'rsatadi", async () => {
    mockApi({ 'GET /debtors': () => Response.json(debtors) });
    renderWithQuery(
      <DebtorList month="2026-10" onPay={vi.fn()} onHistory={vi.fn()} />,
    );

    expect(await screen.findByText('Ali Valiyev')).toBeInTheDocument();
    expect(screen.getByText('Malika Karimova')).toBeInTheDocument();
    expect(screen.getByText('2 ta')).toBeInTheDocument();
    expect(screen.getByText("1 250 000 so'm")).toBeInTheDocument();
  });

  it("so'rovga tanlangan oyni yuboradi", async () => {
    const fetchMock = mockApi({ 'GET /debtors': () => Response.json([]) });
    renderWithQuery(
      <DebtorList month="2026-09" onPay={vi.fn()} onHistory={vi.fn()} />,
    );

    await screen.findByText(/qarzdorlar yo'q/);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/debtors?month=2026-09',
      expect.anything(),
    );
  });

  it("qarzdor bo'lmasa bo'sh holatni ko'rsatadi", async () => {
    mockApi({ 'GET /debtors': () => Response.json([]) });
    renderWithQuery(
      <DebtorList month="2026-10" onPay={vi.fn()} onHistory={vi.fn()} />,
    );

    expect(
      await screen.findByText("Oktabr 2026: qarzdorlar yo'q"),
    ).toBeInTheDocument();
  });

  it("xatoni ko'rsatadi va qayta urinishda ro'yxatni yuklaydi", async () => {
    let calls = 0;
    mockApi({
      'GET /debtors': () =>
        ++calls === 1
          ? Response.json({ message: 'Baza ishlamayapti' }, { status: 500 })
          : Response.json(debtors),
    });
    renderWithQuery(
      <DebtorList month="2026-10" onPay={vi.fn()} onHistory={vi.fn()} />,
    );

    expect(await screen.findByText('Baza ishlamayapti')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /Qayta urinish/ }),
    );
    expect(await screen.findByText('Ali Valiyev')).toBeInTheDocument();
  });

  it("To'lov tugmasi o'sha qarzdorni uzatadi", async () => {
    mockApi({ 'GET /debtors': () => Response.json(debtors) });
    const onPay = vi.fn();
    renderWithQuery(
      <DebtorList month="2026-10" onPay={onPay} onHistory={vi.fn()} />,
    );

    const buttons = await screen.findAllByRole('button', { name: "To'lov" });
    await userEvent.click(buttons[1]);
    expect(onPay).toHaveBeenCalledWith(debtors[1]);
  });
});
