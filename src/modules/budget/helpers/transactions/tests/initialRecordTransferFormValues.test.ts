import { describe, expect, it } from 'vitest';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import { initialRecordTransferFormValues } from '@/modules/budget/helpers/transactions/initialRecordTransferFormValues.ts';

describe('initialRecordTransferFormValues', () => {
  it('defaults from and to, with empty amounts and tags, on a past month', () => {
    expect(
      initialRecordTransferFormValues('from-1', 'to-1', '2020-08-15'),
    ).toEqual({
      sourceAccountId: 'from-1',
      destinationAccountId: 'to-1',
      amount: '',
      foreignAmount: '',
      date: '2020-08-01',
      description: '',
      tags: [],
    });
  });

  it('uses today when the budget month is the current month', () => {
    const today = todayIso();

    expect(
      initialRecordTransferFormValues('from-1', 'to-1', startOfMonth(today))
        .date,
    ).toBe(today);
  });
});
