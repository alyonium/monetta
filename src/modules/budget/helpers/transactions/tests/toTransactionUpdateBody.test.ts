import { describe, expect, it } from 'vitest';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { toTransactionUpdateBody } from '@/modules/budget/helpers/transactions/toTransactionUpdateBody.ts';

const baseInput = {
  journalId: '101',
  type: FIREFLY_TRANSACTION_TYPE.WITHDRAWAL,
  sourceId: 'current-1',
  destinationId: 'expense-2',
  amount: 12.5,
  currencyCode: 'EUR',
  date: '2026-09-13',
  description: 'Lunch',
  tags: ['food'],
};

describe('toTransactionUpdateBody', () => {
  it('maps the split with its journal id and tags', () => {
    expect(toTransactionUpdateBody(baseInput)).toEqual({
      transactions: [
        {
          transaction_journal_id: '101',
          type: FIREFLY_TRANSACTION_TYPE.WITHDRAWAL,
          source_id: 'current-1',
          destination_id: 'expense-2',
          amount: '12.5',
          currency_code: 'EUR',
          date: '2026-09-13T12:00:00',
          description: 'Lunch',
          tags: ['food'],
        },
      ],
    });
  });

  it('sends an empty tag list so Firefly clears the tags', () => {
    expect(
      toTransactionUpdateBody({ ...baseInput, tags: [] }).transactions?.[0]
        ?.tags,
    ).toEqual([]);
  });
});
