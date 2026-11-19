import { formatAccountTransactionGroupDate } from '@/modules/budget/helpers/transactions/accountTransactionDate.ts';
import {
  AccountTransaction,
  AccountTransactionGroup,
} from '@/modules/budget/types/accountTransaction.ts';

export const ACCOUNT_TRANSACTION_ORDER = {
  DESC: 'desc',
  ASC: 'asc',
} as const;

export type AccountTransactionOrder =
  (typeof ACCOUNT_TRANSACTION_ORDER)[keyof typeof ACCOUNT_TRANSACTION_ORDER];

const compareByOrder = (
  left: string,
  right: string,
  order: AccountTransactionOrder,
): number => {
  if (left === right) {
    return 0;
  }

  const earlierFirst = left < right ? -1 : 1;

  return order === ACCOUNT_TRANSACTION_ORDER.ASC ? earlierFirst : -earlierFirst;
};

export const groupAccountTransactions = (
  items: AccountTransaction[],
  order: AccountTransactionOrder = ACCOUNT_TRANSACTION_ORDER.DESC,
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
    .sort(([left], [right]) => compareByOrder(left, right, order))
    .map(([date, groupItems]) => ({
      date,
      label: formatAccountTransactionGroupDate(date),
      items: [...groupItems].sort((left, right) =>
        compareByOrder(left.dateTime, right.dateTime, order),
      ),
    }));
};
