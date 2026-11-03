import { arrayMove } from '@dnd-kit/sortable';
import { slicePage } from '@/modules/budget/helpers/layout/accountBlockPaging.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

const accountsOf = (items: AccountPageItem[]): BudgetAccount[] =>
  items.flatMap((item) => (item.type === 'account' ? [item.account] : []));

const sameIds = (left: BudgetAccount[], right: BudgetAccount[]): boolean =>
  left.length === right.length &&
  left.every((account, index) => account.id === right[index]?.id);

export const previewAccountPage = (
  items: AccountPageItem[],
  page: number,
  pageSize: number,
  activeId: string,
  overId: string,
): AccountPageItem[] | null => {
  const accounts = accountsOf(items);
  const from = accounts.findIndex((account) => account.id === activeId);
  const to = accounts.findIndex((account) => account.id === overId);

  if (from < 0 || to < 0 || from === to) {
    return null;
  }

  const current = slicePage(accounts, page, pageSize);
  const preview = slicePage(arrayMove(accounts, from, to), page, pageSize);

  if (sameIds(current, preview)) {
    return null;
  }

  return preview.map((account) => ({ type: 'account', account }));
};

export const dragComesFrom = (
  items: AccountPageItem[],
  page: number,
  pageSize: number,
  activeId: string,
): 'previous' | 'next' | null => {
  const accounts = accountsOf(items);
  const from = accounts.findIndex((account) => account.id === activeId);
  const pageItems = slicePage(accounts, page, pageSize);
  const start = accounts.findIndex(
    (account) => account.id === pageItems[0]?.id,
  );

  if (from < 0 || start < 0) {
    return null;
  }

  if (from < start) {
    return 'previous';
  }

  if (from >= start + pageItems.length) {
    return 'next';
  }

  return null;
};
