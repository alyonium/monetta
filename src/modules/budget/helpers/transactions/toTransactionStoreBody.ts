import type { TransactionStoreWritable } from '@/api/types.gen.ts';
import type { ToTransactionStoreBodyInput } from '@/modules/budget/types/createBudgetTransaction.ts';

export const toTransactionStoreBody = ({
  type,
  sourceId,
  destinationId,
  amount,
  currencyCode,
  date,
  description,
  tags,
}: ToTransactionStoreBodyInput): TransactionStoreWritable => {
  const split: TransactionStoreWritable['transactions'][number] = {
    type,
    source_id: sourceId,
    destination_id: destinationId,
    amount: String(amount),
    currency_code: currencyCode,
    date: `${date}T12:00:00`,
    description,
  };

  if (tags.length > 0) {
    split.tags = tags;
  }

  return { transactions: [split] };
};
