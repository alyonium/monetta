import { describe, expect, it } from 'vitest';
import { isEditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { createAccountTransaction } from './testHelpers.ts';

describe('isEditableAccountTransaction', () => {
  it.each(['deposit', 'withdrawal', 'transfer'] as const)(
    'allows a %s',
    (type) => {
      expect(
        isEditableAccountTransaction(createAccountTransaction({ type })),
      ).toBe(true);
    },
  );

  it.each(['reconciliation', 'opening balance'] as const)(
    'leaves a %s closed',
    (type) => {
      expect(
        isEditableAccountTransaction(createAccountTransaction({ type })),
      ).toBe(false);
    },
  );

  it('leaves a missing journal id closed', () => {
    expect(
      isEditableAccountTransaction(
        createAccountTransaction({ journalId: null }),
      ),
    ).toBe(false);
  });
});
