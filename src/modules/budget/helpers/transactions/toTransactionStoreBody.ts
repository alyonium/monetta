import type { TransactionStoreWritable } from '@/api/types.gen.ts';
import { transactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
import type { ToTransactionStoreBodyInput } from '@/modules/budget/types/createBudgetTransaction.ts';

export const toTransactionStoreBody = ({
  type,
  sourceId,
  destinationId,
  amount,
  currencyCode,
  foreign,
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
    description: transactionDescription(description),
  };

  if (foreign) {
    split.foreign_amount = String(foreign.amount);
    split.foreign_currency_code = foreign.currencyCode;
  }

  if (tags.length > 0) {
    split.tags = tags;
  }

  return { transactions: [split] };
};
