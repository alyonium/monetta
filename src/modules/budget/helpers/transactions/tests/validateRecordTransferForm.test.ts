import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { validateRecordTransferForm } from '@/modules/budget/helpers/transactions/validateRecordTransferForm.ts';
import type { RecordTransferFormValues } from '@/modules/budget/types/recordTransferForm.ts';
import { createBudgetAccount } from './testHelpers.ts';

const eur = createBudgetAccount({
  id: 'eur-1',
  type: ACCOUNT_TYPE.CURRENT,
  currencyCode: 'EUR',
});

const eurOther = createBudgetAccount({
  id: 'eur-2',
  type: ACCOUNT_TYPE.CURRENT,
  currencyCode: 'EUR',
});

const usd = createBudgetAccount({
  id: 'usd-1',
  type: ACCOUNT_TYPE.CURRENT,
  currencyCode: 'USD',
});

const accounts = [eur, eurOther, usd];

const values = (
  extra: Partial<RecordTransferFormValues> = {},
): RecordTransferFormValues => ({
  sourceAccountId: eur.id,
  destinationAccountId: eurOther.id,
  amount: '12.5',
  foreignAmount: '',
  date: '2026-10-02',
  description: '',
  tags: [],
  ...extra,
});

describe('validateRecordTransferForm', () => {
  it('rejects an account id that is not in the current list', () => {
    expect(
      validateRecordTransferForm(
        values({ sourceAccountId: 'missing' }),
        accounts,
      ),
    ).toEqual({
      sourceAccountId: 'budget.recordTransaction.errors.accountRequired',
    });
    expect(
      validateRecordTransferForm(
        values({ destinationAccountId: 'missing' }),
        accounts,
      ),
    ).toEqual({
      destinationAccountId: 'budget.recordTransaction.errors.accountRequired',
    });
  });

  it('rejects the same from and to account', () => {
    expect(
      validateRecordTransferForm(
        values({ destinationAccountId: eur.id }),
        accounts,
      ),
    ).toEqual({
      destinationAccountId: 'budget.recordTransfer.errors.sameAccount',
    });
  });

  it('rejects an empty amount when currencies match', () => {
    expect(
      validateRecordTransferForm(values({ amount: '' }), accounts),
    ).toEqual({
      amount: 'budget.recordTransaction.errors.amountRequired',
    });
  });

  it('rejects an empty credited amount when currencies differ', () => {
    expect(
      validateRecordTransferForm(
        values({
          destinationAccountId: usd.id,
          foreignAmount: '',
        }),
        accounts,
      ),
    ).toEqual({
      foreignAmount: 'budget.recordTransaction.errors.amountRequired',
    });
  });

  it('rejects an empty date', () => {
    expect(validateRecordTransferForm(values({ date: '' }), accounts)).toEqual({
      date: 'budget.recordTransaction.errors.dateRequired',
    });
  });

  it('accepts a same-currency transfer without a description or credited amount', () => {
    expect(validateRecordTransferForm(values(), accounts)).toEqual({});
  });

  it('accepts a cross-currency transfer without a description', () => {
    expect(
      validateRecordTransferForm(
        values({
          destinationAccountId: usd.id,
          amount: '10',
          foreignAmount: '11',
        }),
        accounts,
      ),
    ).toEqual({});
  });
});
