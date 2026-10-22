import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { todayIso } from '@/lib/date';
import { debtors, students } from '@/test/fixtures';
import { mockApi, renderWithQuery } from '@/test/utils';
import { DebtorsPage } from '../debtors-page';

describe("DebtorsPage: kartochkadan to'lov qo'shish", () => {
  it("forma qarz bilan to'ladi, saqlangach ro'yxat yangilanadi", async () => {
    let paid = false;
    const fetchMock = mockApi({
      'GET /debtors': () => Response.json(paid ? debtors.slice(1) : debtors),
      'GET /students': () => Response.json(students),
      'POST /payments': () => {
        paid = true;
        return Response.json(
          { id: 9, studentId: 1, amount: 450_000, paidAt: todayIso() },
          { status: 201 },
        );
      },
    });
    renderWithQuery(<DebtorsPage />);

    const [payAli] = await screen.findAllByRole('button', { name: "To'lov" });
    await userEvent.click(payAli);

    const drawer = await screen.findByRole('dialog');
    expect(within(drawer).getByLabelText("Summa, so'm")).toHaveValue('450 000');
    expect(
      await within(drawer).findByText('Ali Valiyev · Frontend-1'),
    ).toBeInTheDocument();

    await userEvent.click(
      within(drawer).getByRole('button', { name: "To'lovni saqlash" }),
    );

    await waitFor(() =>
      expect(screen.queryByText('Ali Valiyev')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('1 ta')).toBeInTheDocument();
    const debtorCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).startsWith('/api/debtors'),
    );
    expect(debtorCalls.length).toBeGreaterThanOrEqual(2);
  });
});
