import { describe, expect, it } from 'vitest';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { formatAnalyticsAxisAmount } from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';

const euro: WalletCurrency = {
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  decimalPlaces: 2,
};

describe('formatAnalyticsAxisAmount', () => {
  it('drops trailing zeros from a whole amount', () => {
    expect(formatAnalyticsAxisAmount(6000, euro)).toBe('6000 €');
    expect(formatAnalyticsAxisAmount(0, euro)).toBe('0 €');
  });

  it('keeps a significant fraction', () => {
    expect(formatAnalyticsAxisAmount(1500.5, euro)).toBe('1500.5 €');
    expect(formatAnalyticsAxisAmount(4813.01, euro)).toBe('4813.01 €');
  });

  it('uses the currency code when the symbol is empty', () => {
    expect(
      formatAnalyticsAxisAmount(10, {
        ...euro,
        symbol: '',
      }),
    ).toBe('10 EUR');
  });
});
