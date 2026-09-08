import { describe, expect, it } from 'vitest';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import type { WalletCurrency } from '@/helpers/currency/types.ts';

const euro: WalletCurrency = {
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  decimalPlaces: 2,
};

describe('formatWalletAmount', () => {
  it('pads to the currency decimal places and uses the symbol', () => {
    expect(formatWalletAmount(12.5, euro)).toBe('12.50 €');
    expect(formatWalletAmount(-20, euro)).toBe('-20.00 €');
    expect(formatWalletAmount(0, euro)).toBe('0.00 €');
  });

  it('uses the currency code when the symbol is empty', () => {
    expect(
      formatWalletAmount(10, {
        ...euro,
        symbol: '',
      }),
    ).toBe('10.00 EUR');
  });

  it('formats the amount alone when symbol and code are empty', () => {
    expect(
      formatWalletAmount(1.5, {
        code: '',
        name: '',
        symbol: '',
        decimalPlaces: 1,
      }),
    ).toBe('1.5');
  });
});
