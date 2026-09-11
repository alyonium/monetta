import { ACCOUNT_TRANSACTIONS_STATUS } from '@/modules/budget/constants/transactions.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export type AccountTransactionsStatus =
  (typeof ACCOUNT_TRANSACTIONS_STATUS)[keyof typeof ACCOUNT_TRANSACTIONS_STATUS];

type AccountTransactionsQuery = {
  data: AccountTransaction[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const accountTransactionsStatus = (
  query: AccountTransactionsQuery,
  hasItems: boolean,
): AccountTransactionsStatus => {
  if (query.data === undefined) {
    if (query.isLoading) {
      return ACCOUNT_TRANSACTIONS_STATUS.LOADING;
    }

    if (query.isError) {
      return ACCOUNT_TRANSACTIONS_STATUS.ERROR;
    }

    return ACCOUNT_TRANSACTIONS_STATUS.EMPTY;
  }

  if (hasItems) {
    return ACCOUNT_TRANSACTIONS_STATUS.READY;
  }

  return ACCOUNT_TRANSACTIONS_STATUS.EMPTY;
};
