import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const sortAccountsByOrder = (
  accounts: BudgetAccount[],
  orderedIds: string[],
): BudgetAccount[] => {
  const byId = new Map(accounts.map((account) => [account.id, account]));
  const placed = new Set<string>();
  const ordered: BudgetAccount[] = [];

  orderedIds.forEach((id) => {
    if (placed.has(id)) {
      return;
    }

    const account = byId.get(id);

    if (!account) {
      return;
    }

    placed.add(id);
    ordered.push(account);
  });

  accounts.forEach((account) => {
    if (placed.has(account.id)) {
      return;
    }

    placed.add(account.id);
    ordered.push(account);
  });

  return ordered;
};
