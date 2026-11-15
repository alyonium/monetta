import { describe, expect, it } from 'vitest';
import { initialEditTransactionFormValues } from '@/modules/budget/helpers/transactions/initialEditTransactionFormValues.ts';
import { createAccountTransaction } from './testHelpers.ts';

describe('initialEditTransactionFormValues', () => {
  it('keeps a real description, tags, and foreign amount', () => {
    expect(
      initialEditTransactionFormValues(
        createAccountTransaction({
          sourceId: 'current-1',
          destinationId: 'expense-2',
          amount: 12.5,
          foreignAmount: 11,
          date: '2026-03-02',
          description: 'Lunch',
          tags: ['food'],
        }),
      ),
    ).toEqual({
      sourceAccountId: 'current-1',
      destinationAccountId: 'expense-2',
      amount: 12.5,
      foreignAmount: 11,
      date: '2026-03-02',
      description: 'Lunch',
      tags: ['food'],
    });
  });

  it('clears a blank description and an absent foreign amount', () => {
    expect(
      initialEditTransactionFormValues(
        createAccountTransaction({
          description: '\u2066',
          foreignAmount: null,
        }),
      ),
    ).toMatchObject({
      description: '',
      foreignAmount: '',
    });
  });
});
