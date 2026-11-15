import { TransactionStoreWritable } from '@/api/types.gen.ts';
import { toTransactionSplit } from '@/modules/budget/helpers/transactions/toTransactionSplit.ts';
import { ToTransactionStoreBodyInput } from '@/modules/budget/types/createBudgetTransaction.ts';

export const toTransactionStoreBody = (
  input: ToTransactionStoreBodyInput,
): TransactionStoreWritable => {
  const split: TransactionStoreWritable['transactions'][number] =
    toTransactionSplit(input);

  if (input.tags.length > 0) {
    split.tags = input.tags;
  }

  return { transactions: [split] };
};
