import { transactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
import { ToTransactionStoreBodyInput } from '@/modules/budget/types/createBudgetTransaction.ts';

export type TransactionSplitFields = {
  type: ToTransactionStoreBodyInput['type'];
  source_id: string;
  destination_id: string;
  amount: string;
  currency_code: string;
  date: string;
  description: string;
  foreign_amount?: string;
  foreign_currency_code?: string;
};

export const toTransactionSplit = ({
  type,
  sourceId,
  destinationId,
  amount,
  currencyCode,
  foreign,
  date,
  description,
}: Omit<ToTransactionStoreBodyInput, 'tags'>): TransactionSplitFields => {
  const split: TransactionSplitFields = {
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

  return split;
};
