import type { TransactionRead, TransactionSplit } from '@/api/types.gen.ts';
import { toFiniteNumber } from '@/modules/budget/helpers/account/toFiniteNumber.ts';
import { accountTransactionDate } from '@/modules/budget/helpers/transactions/accountTransactionDate.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

const toAccountTransaction = (
  groupId: string,
  split: TransactionSplit,
  index: number,
): AccountTransaction | null => {
  const date = accountTransactionDate(split.date);
  const journalId = split.transaction_journal_id ?? '';

  if (!date || (!groupId && !journalId)) {
    return null;
  }

  const amount = toFiniteNumber(split.amount);

  if (amount === null) {
    return null;
  }

  return {
    id: groupId,
    journalId: journalId || `${groupId}:${index}`,
    date,
    dateTime: split.date,
    description: split.description,
    sourceId: split.source_id ?? '',
    destinationId: split.destination_id ?? '',
    sourceName: split.source_name ?? '',
    destinationName: split.destination_name ?? '',
    amount,
    currencyCode: (
      split.currency_code?.trim() ||
      split.primary_currency_code?.trim() ||
      ''
    ).toUpperCase(),
    currencySymbol:
      split.currency_symbol || split.primary_currency_symbol || '',
    type: split.type,
    tags: split.tags?.filter((tag) => tag !== '') ?? [],
  };
};

export const toAccountTransactions = (
  groups: Pick<TransactionRead, 'id' | 'attributes'>[],
): AccountTransaction[] => {
  const items: AccountTransaction[] = [];

  groups.forEach((group) => {
    group.attributes.transactions.forEach((split, index) => {
      const mapped = toAccountTransaction(group.id, split, index);

      if (mapped) {
        items.push(mapped);
      }
    });
  });

  return items;
};
