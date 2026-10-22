import { describe, expect, it } from 'vitest';
import { debtStatus } from '../debt-status';

describe('debtStatus', () => {
  it("to'lov bo'lmasa to'lamagan, qisman bo'lsa qisman", () => {
    expect(debtStatus({ paid: 0 })).toBe('unpaid');
    expect(debtStatus({ paid: 150_000 })).toBe('partial');
  });
});
