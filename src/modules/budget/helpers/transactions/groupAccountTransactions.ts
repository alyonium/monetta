import { formatAccountTransactionGroupDate } from '@/modules/budget/helpers/transactions/accountTransactionDate.ts';
import type {
  AccountTransaction,
  AccountTransactionGroup,
} from '@/modules/budget/types/accountTransaction.ts';

const compareDesc = (left: string, right: string): number => {
  if (left < right) {
    return 1;
  }

  if (left > right) {
    return -1;
  }

  return 0;
};

export const groupAccountTransactions = (
  items: AccountTransaction[],
): AccountTransactionGroup[] => {
  const byDate = new Map<string, AccountTransaction[]>();

  items.forEach((item) => {
    const group = byDate.get(item.date);

    if (group) {
      group.push(item);
      return;
    }

    byDate.set(item.date, [item]);
  });

  return [...byDate.entries()]
    .sort(([left], [right]) => compareDesc(left, right))
    .map(([date, groupItems]) => ({
      date,
      label: formatAccountTransactionGroupDate(date),
      items: [...groupItems].sort((left, right) =>
        compareDesc(left.dateTime, right.dateTime),
      ),
    }));
};
