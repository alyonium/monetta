import { listTransactionByAccount } from '@/api/sdk.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ACCOUNT_TRANSACTIONS_MISSING_ERROR,
  ACCOUNT_TRANSACTIONS_PAGE_LIMIT,
} from '@/modules/budget/constants/queries.ts';
import { toAccountTransactions } from '@/modules/budget/helpers/transactions/toAccountTransactions.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export const fetchAccountTransactions = async (
  accountId: string,
): Promise<AccountTransaction[]> => {
  const items = await collectFireflyPages(
    (page) =>
      listTransactionByAccount({
        path: { id: accountId },
        query: { page, limit: ACCOUNT_TRANSACTIONS_PAGE_LIMIT },
      }),
    ACCOUNT_TRANSACTIONS_MISSING_ERROR,
  );

  return toAccountTransactions(items);
};
