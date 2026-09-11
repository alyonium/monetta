import { describe, expect, it } from 'vitest';
import { toAccountTransactions } from '@/modules/budget/helpers/transactions/toAccountTransactions.ts';
import {
  createFireflyTransaction,
  createTransactionSplit,
} from './testHelpers.ts';

describe('toAccountTransactions', () => {
  it('flattens every split from every group', () => {
    const items = toAccountTransactions([
      createFireflyTransaction('10', [
        createTransactionSplit({
          transaction_journal_id: '101',
          date: '2026-03-02T18:30:00+01:00',
          description: 'Lunch',
          source_name: 'Wallet',
          destination_name: 'Cafe',
          amount: '12.5',
          currency_code: 'eur',
          currency_symbol: '€',
          type: 'withdrawal',
          tags: ['food', ''],
        }),
        createTransactionSplit({
          transaction_journal_id: '102',
          date: '2026-03-02T19:00:00+01:00',
          description: 'Tip',
          source_name: 'Wallet',
          destination_name: 'Cafe',
          amount: '2',
          currency_code: 'EUR',
          currency_symbol: '€',
        }),
      ]),
      createFireflyTransaction('11', [
        createTransactionSplit({
          transaction_journal_id: '103',
          date: '2026-04-01T09:00:00Z',
          description: 'Salary',
          source_name: 'Job',
          destination_name: 'Wallet',
          amount: '1000',
          type: 'deposit',
        }),
      ]),
    ]);

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.journalId)).toEqual(['101', '102', '103']);
    expect(items[0]).toMatchObject({
      id: '10',
      date: '2026-03-02',
      amount: 12.5,
      currencyCode: 'EUR',
      tags: ['food'],
    });
    expect(items[2]).toMatchObject({
      id: '11',
      date: '2026-04-01',
      amount: 1000,
      currencyCode: '',
      tags: [],
    });
  });

  it('skips splits without a date, identity, or amount', () => {
    const items = toAccountTransactions([
      createFireflyTransaction('10', [
        createTransactionSplit({ date: '   ', transaction_journal_id: '1' }),
        createTransactionSplit({
          date: 'not-a-date',
          transaction_journal_id: '2',
        }),
        createTransactionSplit({ amount: 'nope', transaction_journal_id: '3' }),
      ]),
      createFireflyTransaction('', [
        createTransactionSplit({ transaction_journal_id: '' }),
      ]),
    ]);

    expect(items).toEqual([]);
  });

  it('uses the group id and index when the journal id is missing', () => {
    const items = toAccountTransactions([
      createFireflyTransaction('10', [
        createTransactionSplit({ transaction_journal_id: undefined }),
      ]),
    ]);

    expect(items).toEqual([
      expect.objectContaining({
        id: '10',
        journalId: '10:0',
        date: '2026-01-15',
      }),
    ]);
  });
});
