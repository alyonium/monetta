import { describe, expect, it } from 'vitest';
import { ACCOUNT_TRANSACTIONS_STATUS } from '@/modules/budget/constants/transactions.ts';
import { accountTransactionsStatus } from '@/modules/budget/helpers/transactions/accountTransactionsStatus.ts';
import { createAccountTransaction } from './testHelpers.ts';

describe('accountTransactionsStatus', () => {
  it('keeps cached data instead of loading or error', () => {
    expect(
      accountTransactionsStatus(
        {
          data: [createAccountTransaction()],
          isLoading: true,
          isError: true,
        },
        true,
      ),
    ).toBe(ACCOUNT_TRANSACTIONS_STATUS.READY);
  });
});
