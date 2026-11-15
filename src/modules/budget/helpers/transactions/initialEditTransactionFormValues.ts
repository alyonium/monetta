import { hasTransactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import type { RecordTransferFormValues } from '@/modules/budget/types/recordTransferForm.ts';

export const initialEditTransactionFormValues = (
  transaction: AccountTransaction,
): RecordTransferFormValues => ({
  sourceAccountId: transaction.sourceId,
  destinationAccountId: transaction.destinationId,
  amount: transaction.amount,
  foreignAmount: transaction.foreignAmount ?? '',
  date: transaction.date,
  description: hasTransactionDescription(transaction.description)
    ? transaction.description
    : '',
  tags: transaction.tags,
});
