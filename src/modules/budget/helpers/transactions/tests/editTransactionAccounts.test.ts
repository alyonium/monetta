import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import {
  createBudgetAccount,
  createCurrentAccount,
} from '@/modules/budget/helpers/account/tests/testHelpers.ts';
import {
  editTransactionAccounts,
  editTransactionCurrencies,
} from '@/modules/budget/helpers/transactions/editTransactionAccounts.ts';

const income = createBudgetAccount({
  id: 'income',
  type: ACCOUNT_TYPE.INCOME,
});

const eur = createCurrentAccount('eur', 0, 'EUR');

const usd = createCurrentAccount('usd', 0, 'USD');

const expense = createBudgetAccount({
  id: 'expense',
  type: ACCOUNT_TYPE.EXPENSE,
});

const accounts = {
  [ACCOUNT_TYPE.INCOME]: [income],
  [ACCOUNT_TYPE.CURRENT]: [eur, usd],
  [ACCOUNT_TYPE.EXPENSE]: [expense],
};

describe('editTransactionAccounts', () => {
  it('keeps each transaction type on its own account lists', () => {
    expect(
      editTransactionAccounts(FIREFLY_TRANSACTION_TYPE.DEPOSIT, accounts),
    ).toEqual({
      sourceAccounts: [income],
      destinationAccounts: [eur, usd],
    });
    expect(
      editTransactionAccounts(FIREFLY_TRANSACTION_TYPE.WITHDRAWAL, accounts),
    ).toEqual({
      sourceAccounts: [eur, usd],
      destinationAccounts: [expense],
    });
    expect(
      editTransactionAccounts(FIREFLY_TRANSACTION_TYPE.TRANSFER, accounts),
    ).toEqual({
      sourceAccounts: [eur, usd],
      destinationAccounts: [eur, usd],
    });
  });
});

describe('editTransactionCurrencies', () => {
  it('uses the current account currency for a deposit or withdrawal', () => {
    expect(
      editTransactionCurrencies(FIREFLY_TRANSACTION_TYPE.DEPOSIT, income, usd),
    ).toEqual({
      currencyCode: 'USD',
      foreignCurrencyCode: '',
      currenciesDiffer: false,
    });
    expect(
      editTransactionCurrencies(
        FIREFLY_TRANSACTION_TYPE.WITHDRAWAL,
        usd,
        expense,
      ),
    ).toEqual({
      currencyCode: 'USD',
      foreignCurrencyCode: '',
      currenciesDiffer: false,
    });
  });

  it('shows a credited currency only when a transfer crosses currencies', () => {
    expect(
      editTransactionCurrencies(FIREFLY_TRANSACTION_TYPE.TRANSFER, eur, eur),
    ).toEqual({
      currencyCode: 'EUR',
      foreignCurrencyCode: '',
      currenciesDiffer: false,
    });
    expect(
      editTransactionCurrencies(FIREFLY_TRANSACTION_TYPE.TRANSFER, eur, usd),
    ).toEqual({
      currencyCode: 'EUR',
      foreignCurrencyCode: 'USD',
      currenciesDiffer: true,
    });
  });
});
