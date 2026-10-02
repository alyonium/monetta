import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { validateRecordTransactionForm } from '@/modules/budget/helpers/transactions/validateRecordTransactionForm.ts';
import type { RecordTransactionFormValues } from '@/modules/budget/types/recordTransactionForm.ts';
import { createBudgetAccount } from './testHelpers.ts';

const source = createBudgetAccount({
  id: 'src-1',
  type: ACCOUNT_TYPE.CURRENT,
  currencyCode: 'EUR',
});

const destination = createBudgetAccount({
  id: 'dst-1',
  type: ACCOUNT_TYPE.EXPENSE,
  name: 'Groceries',
});

const values = (
  extra: Partial<RecordTransactionFormValues> = {},
): RecordTransactionFormValues => ({
  sourceAccountId: source.id,
  destinationAccountId: destination.id,
  amount: '12.5',
  date: '2026-10-02',
  description: '',
  tags: [],
  ...extra,
});

describe('validateRecordTransactionForm', () => {
  it('accepts ids that resolve in the passed lists', () => {
    expect(
      validateRecordTransactionForm(values(), [source], [destination]),
    ).toEqual({});
  });

  it('rejects a source id that is not in the source list', () => {
    expect(
      validateRecordTransactionForm(
        values({ sourceAccountId: destination.id }),
        [source],
        [destination],
      ),
    ).toEqual({
      sourceAccountId: 'budget.recordTransaction.errors.accountRequired',
    });
  });

  it('rejects a destination id that is not in the destination list', () => {
    expect(
      validateRecordTransactionForm(
        values({ destinationAccountId: '' }),
        [source],
        [destination],
      ),
    ).toEqual({
      destinationAccountId: 'budget.recordTransaction.errors.accountRequired',
    });
  });

  it('rejects an empty amount and date without touching description', () => {
    expect(
      validateRecordTransactionForm(
        values({ amount: '', date: '', description: '' }),
        [source],
        [destination],
      ),
    ).toEqual({
      amount: 'budget.recordTransaction.errors.amountRequired',
      date: 'budget.recordTransaction.errors.dateRequired',
    });
  });
});
