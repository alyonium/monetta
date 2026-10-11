import { describe, expect, it } from 'vitest';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { hasTransactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
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

  it('omits tags when the list is empty and fills a blank description with an invisible mark', () => {
    const body = toTransactionStoreBody({
      ...baseInput,
      description: '   ',
      tags: [],
    });

    expect(body).toEqual({
      transactions: [
        {
          type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
          source_id: 'income-1',
          destination_id: 'current-2',
          amount: '12.5',
          currency_code: 'EUR',
          date: '2026-09-13T12:00:00',
          description: '\u2066',
        },
      ],
    });
    expect(hasTransactionDescription(body.transactions[0].description)).toBe(
      false,
    );
  });

  it('omits foreign fields when a transfer has no foreign amount', () => {
    expect(
      toTransactionStoreBody({
        ...baseInput,
        type: FIREFLY_TRANSACTION_TYPE.TRANSFER,
        sourceId: 'current-1',
        destinationId: 'current-2',
      }),
    ).toEqual({
      transactions: [
        {
          type: FIREFLY_TRANSACTION_TYPE.TRANSFER,
          source_id: 'current-1',
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

  it('adds foreign amount and currency when foreign is passed', () => {
    expect(
      toTransactionStoreBody({
        ...baseInput,
        type: FIREFLY_TRANSACTION_TYPE.TRANSFER,
        sourceId: 'current-eur',
        destinationId: 'current-usd',
        amount: 10,
        currencyCode: 'EUR',
        foreign: { amount: 11, currencyCode: 'USD' },
      }),
    ).toEqual({
      transactions: [
        {
          type: FIREFLY_TRANSACTION_TYPE.TRANSFER,
          source_id: 'current-eur',
          destination_id: 'current-usd',
          amount: '10',
          currency_code: 'EUR',
          foreign_amount: '11',
          foreign_currency_code: 'USD',
          date: '2026-09-13T12:00:00',
          description: '  bonus  ',
          tags: ['gift', 'salary'],
        },
      ],
    });
  });
});
