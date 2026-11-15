import type { TransactionRead, TransactionSplit } from '@/api/types.gen.ts';
import { toFiniteNumber } from '@/modules/budget/helpers/account/toFiniteNumber.ts';
import { accountTransactionDate } from '@/modules/budget/helpers/transactions/accountTransactionDate.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

const toAccountTransaction = (
  groupId: string,
  split: TransactionSplit,
): AccountTransaction | null => {
  const date = accountTransactionDate(split.date);
  const journalId = split.transaction_journal_id ?? null;

  if (!date || (!groupId && !journalId)) {
    return null;
  }

  const amount = toFiniteNumber(split.amount);

  if (amount === null) {
    return null;
  }

  const foreignAmount =
    split.foreign_amount == null ? null : toFiniteNumber(split.foreign_amount);

  return {
    id: groupId,
    journalId,
    date,
    dateTime: split.date,
    description: split.description,
    sourceId: split.source_id ?? '',
    destinationId: split.destination_id ?? '',
    sourceName: split.source_name ?? '',
    destinationName: split.destination_name ?? '',
    amount,
    currencyCode: (
      split.currency_code ??
      split.primary_currency_code ??
      ''
    ).toUpperCase(),
    currencySymbol:
      split.currency_symbol || split.primary_currency_symbol || '',
    foreignAmount,
    foreignCurrencyCode: (split.foreign_currency_code ?? '').toUpperCase(),
    type: split.type,
    tags: split.tags?.filter((tag) => tag !== '') ?? [],
  };
};

export const toAccountTransactions = (
  groups: Pick<TransactionRead, 'id' | 'attributes'>[],
): AccountTransaction[] => {
  const items: AccountTransaction[] = [];

  groups.forEach((group) => {
    group.attributes.transactions.forEach((split) => {
      const mapped = toAccountTransaction(group.id, split);

      if (mapped) {
        items.push(mapped);
      }
    });
  });

  return items;
};
