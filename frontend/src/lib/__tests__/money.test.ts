import { describe, expect, it } from 'vitest';
import { formatMoney, groupDigits, parseAmount } from '../money';

describe('money', () => {
  it('raqamlarni uchtadan guruhlaydi', () => {
    expect(groupDigits(0)).toBe('0');
    expect(groupDigits(500)).toBe('500');
    expect(groupDigits(1_250_000)).toBe('1 250 000');
    expect(formatMoney(300_000)).toBe("300 000 so'm");
  });

  it("parseAmount bo'shliqlarni olib tashlaydi, raqam bo'lmasa NaN", () => {
    expect(parseAmount('1 250 000')).toBe(1_250_000);
    expect(parseAmount('500000')).toBe(500_000);
    expect(parseAmount('12.5')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
  });
});
