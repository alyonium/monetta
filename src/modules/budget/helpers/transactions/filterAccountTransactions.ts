import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

const searchableText = (item: AccountTransaction): string =>
  [
    item.description,
    item.sourceName,
    item.destinationName,
    item.currencyCode,
    item.currencySymbol,
    String(item.amount),
    item.type,
    ...item.tags,
  ]
    .join(' ')
    .toLowerCase();

export const filterAccountTransactions = (
  items: AccountTransaction[],
  query: string,
): AccountTransaction[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => searchableText(item).includes(normalizedQuery));
};
