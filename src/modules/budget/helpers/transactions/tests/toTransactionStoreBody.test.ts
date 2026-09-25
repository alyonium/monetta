import { describe, expect, it } from 'vitest';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { toTransactionStoreBody } from '@/modules/budget/helpers/transactions/toTransactionStoreBody.ts';

const baseInput = {
  type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
  sourceId: 'income-1',
  destinationId: 'current-2',
  amount: 12.5,
  currencyCode: 'EUR',
  date: '2026-09-13',
  description: '  bonus  ',
  tags: ['gift', 'salary'],
};

describe('toTransactionStoreBody', () => {
  it('maps a deposit split with amount string, noon date, and tags', () => {
    expect(toTransactionStoreBody(baseInput)).toEqual({
      transactions: [
        {
          type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
          source_id: 'income-1',
          destination_id: 'current-2',
          amount: '12.5',
          currency_code: 'EUR',
          date: '2026-09-13T12:00:00',
          description: '  bonus  ',
          tags: ['gift', 'salary'],
        },
      ],
    });
  });

  it('omits tags when the list is empty and keeps an empty description', () => {
    expect(
      toTransactionStoreBody({
        ...baseInput,
        description: '',
        tags: [],
      }),
    ).toEqual({
      transactions: [
        {
          type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
          source_id: 'income-1',
          destination_id: 'current-2',
          amount: '12.5',
          currency_code: 'EUR',
          date: '2026-09-13T12:00:00',
          description: '',
        },
      ],
    });
  });
});
