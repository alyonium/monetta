import { describe, expect, it } from 'vitest';
import { historyTransactionAmount } from '@/modules/history/helpers/historyTransactionAmount.ts';

const transaction = {
  amount: 10,
  currencySymbol: '€',
  currencyCode: 'EUR',
  foreignAmount: null as number | null,
  foreignCurrencyCode: '',
};

describe('historyTransactionAmount', () => {
  it('formats one amount when there is no foreign amount', () => {
    expect(historyTransactionAmount(transaction)).toEqual({
      kind: 'single',
      amount: '10 €',
    });
  });

  it('formats one amount when the foreign currency matches the source', () => {
    expect(
      historyTransactionAmount({
        ...transaction,
        foreignAmount: 12,
        foreignCurrencyCode: 'EUR',
      }),
    ).toEqual({
      kind: 'single',
      amount: '10 €',
    });
  });

  it('formats debited and credited amounts when the currencies differ', () => {
    expect(
      historyTransactionAmount({
        ...transaction,
        foreignAmount: 12.5,
        foreignCurrencyCode: 'USD',
      }),
    ).toEqual({
      kind: 'pair',
      debited: '10 €',
      credited: '12.5 USD',
    });
  });
});
