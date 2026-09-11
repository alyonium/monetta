import { describe, expect, it } from 'vitest';
import { filterAccountTransactions } from '@/modules/budget/helpers/transactions/filterAccountTransactions.ts';
import { createAccountTransaction } from './testHelpers.ts';

const lunch = createAccountTransaction({
  journalId: '1',
  description: 'Lunch',
  sourceName: 'Wallet',
  destinationName: 'Cafe',
  amount: 12.5,
  currencyCode: 'EUR',
  currencySymbol: '€',
  type: 'withdrawal',
  tags: ['food'],
});

const rent = createAccountTransaction({
  journalId: '2',
  description: 'Rent',
  sourceName: 'Bank',
  destinationName: 'Landlord',
  amount: 800,
  currencyCode: 'USD',
  currencySymbol: '$',
  type: 'withdrawal',
  tags: ['housing'],
});

describe('filterAccountTransactions', () => {
  it('returns every item when the query is empty or whitespace', () => {
    expect(filterAccountTransactions([lunch, rent], '')).toEqual([
      lunch,
      rent,
    ]);
    expect(filterAccountTransactions([lunch, rent], '   ')).toEqual([
      lunch,
      rent,
    ]);
  });

  it('matches description, from, to, currency, amount, type, and tags', () => {
    expect(filterAccountTransactions([lunch, rent], 'LUNCH')).toEqual([lunch]);
    expect(filterAccountTransactions([lunch, rent], 'wallet')).toEqual([
      lunch,
    ]);
    expect(filterAccountTransactions([lunch, rent], 'landlord')).toEqual([
      rent,
    ]);
    expect(filterAccountTransactions([lunch, rent], 'usd')).toEqual([rent]);
    expect(filterAccountTransactions([lunch, rent], '€')).toEqual([lunch]);
    expect(filterAccountTransactions([lunch, rent], '12.5')).toEqual([lunch]);
    expect(filterAccountTransactions([lunch, rent], 'housing')).toEqual([
      rent,
    ]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterAccountTransactions([lunch, rent], 'salary')).toEqual([]);
  });
});
