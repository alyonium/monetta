import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { RECORD_DROP_KIND } from '@/modules/budget/constants/accountDnd.ts';
import { resolveRecordDrop } from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
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
});

const otherCurrent = createBudgetAccount({
  id: 'cur-2',
  type: ACCOUNT_TYPE.CURRENT,
  name: 'Bank',
});

const expense = createBudgetAccount({
  id: 'exp-1',
  type: ACCOUNT_TYPE.EXPENSE,
  name: 'Groceries',
});

const otherIncome = createBudgetAccount({
  id: 'inc-2',
  type: ACCOUNT_TYPE.INCOME,
  name: 'Gift',
});

describe('resolveRecordDrop', () => {
  it('classifies income onto current as income', () => {
    expect(resolveRecordDrop(income, current)).toEqual({
      kind: RECORD_DROP_KIND.INCOME,
      source: income,
      destination: current,
    });
  });

  it('classifies current onto expense as expense', () => {
    expect(resolveRecordDrop(current, expense)).toEqual({
      kind: RECORD_DROP_KIND.EXPENSE,
      source: current,
      destination: expense,
    });
  });

  it('classifies current onto current as transfer', () => {
    expect(resolveRecordDrop(current, otherCurrent)).toEqual({
      kind: RECORD_DROP_KIND.TRANSFER,
      source: current,
      destination: otherCurrent,
    });
  });

  it('returns null when the account is dropped onto itself', () => {
    expect(resolveRecordDrop(current, current)).toBeNull();
  });

  it('returns null for unmatched or invalid drops', () => {
    expect(resolveRecordDrop(income, otherIncome)).toBeNull();
    expect(resolveRecordDrop(income, income)).toBeNull();
    expect(resolveRecordDrop(income, expense)).toBeNull();
    expect(resolveRecordDrop(undefined, current)).toBeNull();
    expect(resolveRecordDrop(income, null)).toBeNull();
  });
});
