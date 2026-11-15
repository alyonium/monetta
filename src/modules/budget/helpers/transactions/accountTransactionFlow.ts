import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants/transactions.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export type AccountTransactionFlow =
  (typeof ACCOUNT_TRANSACTION_FLOW)[keyof typeof ACCOUNT_TRANSACTION_FLOW];

export const accountTransactionFlow = (
  transaction: Pick<AccountTransaction, 'sourceId' | 'destinationId'>,
  account: { id: string },
): AccountTransactionFlow | null => {
  if (transaction.destinationId === account.id) {
    return ACCOUNT_TRANSACTION_FLOW.IN;
  }

  if (transaction.sourceId === account.id) {
    return ACCOUNT_TRANSACTION_FLOW.OUT;
  }

  return null;
};
