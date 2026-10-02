import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { RECORD_DROP_KIND } from '@/modules/budget/constants/accountDnd.ts';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import {
  recordTransactionCurrencyAccount,
  recordTransactionKindConfig,
  toRecordTransactionDrop,
} from '@/modules/budget/helpers/transactions/recordTransactionKind.ts';
import { createBudgetAccount } from './testHelpers.ts';

const income = createBudgetAccount({
  id: 'inc-1',
  type: ACCOUNT_TYPE.INCOME,
  name: 'Salary',
});

const current = createBudgetAccount({
  id: 'cur-1',
  type: ACCOUNT_TYPE.CURRENT,
  name: 'Wallet',
  currencyCode: 'USD',
});

const expense = createBudgetAccount({
  id: 'exp-1',
  type: ACCOUNT_TYPE.EXPENSE,
  name: 'Groceries',
  currencyCode: 'EUR',
});

describe('recordTransactionKindConfig', () => {
  it('maps income to a deposit whose currency side is current', () => {
    const config = recordTransactionKindConfig[RECORD_DROP_KIND.INCOME];

    expect(config.type).toBe(FIREFLY_TRANSACTION_TYPE.DEPOSIT);
    expect(config.source.accountType).toBe(ACCOUNT_TYPE.INCOME);
    expect(config.destination.accountType).toBe(ACCOUNT_TYPE.CURRENT);
    expect(recordTransactionCurrencyAccount(config, income, current)).toBe(
      current,
    );
  });

  it('maps expense to a withdrawal whose currency side is current', () => {
    const config = recordTransactionKindConfig[RECORD_DROP_KIND.EXPENSE];

    expect(config.type).toBe(FIREFLY_TRANSACTION_TYPE.WITHDRAWAL);
    expect(config.source.accountType).toBe(ACCOUNT_TYPE.CURRENT);
    expect(config.destination.accountType).toBe(ACCOUNT_TYPE.EXPENSE);
    expect(recordTransactionCurrencyAccount(config, current, expense)).toBe(
      current,
    );
  });

  it('drops transfer instead of opening the income and expense form', () => {
    expect(
      toRecordTransactionDrop({
        kind: RECORD_DROP_KIND.TRANSFER,
        source: current,
        destination: expense,
      }),
    ).toBeNull();
  });

  it('keeps an income or expense drop', () => {
    const drop = {
      kind: RECORD_DROP_KIND.EXPENSE,
      source: current,
      destination: expense,
    };

    expect(toRecordTransactionDrop(drop)).toEqual(drop);
  });

  it('returns no currency account when the current side did not resolve', () => {
    const config = recordTransactionKindConfig[RECORD_DROP_KIND.EXPENSE];

    expect(
      recordTransactionCurrencyAccount(config, undefined, expense),
    ).toBeUndefined();
  });
});
