import { describe, expect, it } from 'vitest';
import { colorFor, initials } from '../avatar';

describe('avatar', () => {
  it('ism va familiyaning bosh harflari', () => {
    expect(initials('Usmonov Jasur')).toBe('UJ');
    expect(initials('  ali  valiyev  ota ')).toBe('AV');
    expect(initials('Malika')).toBe('M');
  });

  it("rang ID bo'yicha doimiy, qo'shni ID'lar har xil", () => {
    expect(colorFor(7)).toBe(colorFor(7));
    expect(colorFor(1)).not.toBe(colorFor(2));
  });
});
