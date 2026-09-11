import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export type AccountTransactionFlow =
  (typeof ACCOUNT_TRANSACTION_FLOW)[keyof typeof ACCOUNT_TRANSACTION_FLOW];

type AccountRef = {
  id: string;
  name: string;
};

export const accountTransactionFlow = (
  transaction: Pick<
    AccountTransaction,
    'sourceId' | 'destinationId' | 'sourceName' | 'destinationName'
  >,
  account: AccountRef,
): AccountTransactionFlow | null => {
  if (transaction.destinationId && transaction.destinationId === account.id) {
    return ACCOUNT_TRANSACTION_FLOW.IN;
  }

  if (transaction.sourceId && transaction.sourceId === account.id) {
    return ACCOUNT_TRANSACTION_FLOW.OUT;
  }

  if (transaction.destinationName === account.name) {
    return ACCOUNT_TRANSACTION_FLOW.IN;
  }

  if (transaction.sourceName === account.name) {
    return ACCOUNT_TRANSACTION_FLOW.OUT;
  }

  return null;
};
