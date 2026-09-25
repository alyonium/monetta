import { describe, expect, it } from 'vitest';
import { isValidTransactionAmount } from '@/modules/budget/helpers/transactions/isValidTransactionAmount.ts';

describe('isValidTransactionAmount', () => {
  it('rejects empty, non-numeric, and non-positive amounts', () => {
    expect(isValidTransactionAmount('')).toBe(false);
    expect(isValidTransactionAmount('abc')).toBe(false);
    expect(isValidTransactionAmount(0)).toBe(false);
    expect(isValidTransactionAmount(-1)).toBe(false);
    expect(isValidTransactionAmount('0')).toBe(false);
  });

  it('accepts a positive number or numeric string', () => {
    expect(isValidTransactionAmount(0.01)).toBe(true);
    expect(isValidTransactionAmount(10)).toBe(true);
    expect(isValidTransactionAmount('12.5')).toBe(true);
  });
});
