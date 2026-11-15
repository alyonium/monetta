import type { TransactionUpdateWritable } from '@/api/types.gen.ts';
import { toTransactionSplit } from '@/modules/budget/helpers/transactions/toTransactionSplit.ts';
import type { ToTransactionStoreBodyInput } from '@/modules/budget/types/createBudgetTransaction.ts';

export type ToTransactionUpdateBodyInput = ToTransactionStoreBodyInput & {
  journalId: string;
};

export const toTransactionUpdateBody = ({
  journalId,
  tags,
  ...input
}: ToTransactionUpdateBodyInput): TransactionUpdateWritable => ({
  transactions: [
    {
      ...toTransactionSplit(input),
      transaction_journal_id: journalId,
      tags,
    },
  ],
});
