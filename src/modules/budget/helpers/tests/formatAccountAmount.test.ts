import { describe, expect, it } from 'vitest';
import { formatAccountAmount } from '@/modules/budget/helpers/formatAccountAmount.ts';

describe('formatAccountAmount', () => {
  it('uses the currency symbol when present', () => {
    expect(formatAccountAmount(12.5, '€', 'EUR')).toBe('12.5 €');
    expect(formatAccountAmount(-20, '€', 'EUR')).toBe('-20 €');
  });

  it('uses the currency code when the symbol is empty', () => {
    expect(formatAccountAmount(10, '', 'USD')).toBe('10 USD');
  });

  it('formats the amount alone when both are empty', () => {
    expect(formatAccountAmount(0, '', '')).toBe('0');
  });
});
