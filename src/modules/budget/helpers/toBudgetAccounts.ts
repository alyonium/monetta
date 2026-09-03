import type { AccountRead } from '@/api/types.gen.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { mapFireflyAccount } from '@/modules/budget/helpers/mapFireflyAccount.ts';
import { sortAccountsByOrder } from '@/modules/budget/helpers/sortAccountsByOrder.ts';
import type {
  AccountPreferences,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

const emptyAccountsByType = (): BudgetAccountsByBlock => ({
  [ACCOUNT_TYPE.INCOME]: [],
  [ACCOUNT_TYPE.CURRENT]: [],
  [ACCOUNT_TYPE.EXPENSE]: [],
});

export const toBudgetAccounts = (
  items: Pick<AccountRead, 'id' | 'attributes'>[],
  prefs: AccountPreferences,
): BudgetAccountsByBlock => {
  const grouped = emptyAccountsByType();

  items.forEach((item) => {
    const mapped = mapFireflyAccount(item, prefs.appearanceById[item.id]);

    if (!mapped) {
      return;
    }

    grouped[mapped.type].push(mapped);
  });

  return {
    [ACCOUNT_TYPE.INCOME]: sortAccountsByOrder(
      grouped[ACCOUNT_TYPE.INCOME],
      prefs.orderByBlock[ACCOUNT_TYPE.INCOME],
    ),
    [ACCOUNT_TYPE.CURRENT]: sortAccountsByOrder(
      grouped[ACCOUNT_TYPE.CURRENT],
      prefs.orderByBlock[ACCOUNT_TYPE.CURRENT],
    ),
    [ACCOUNT_TYPE.EXPENSE]: sortAccountsByOrder(
      grouped[ACCOUNT_TYPE.EXPENSE],
      prefs.orderByBlock[ACCOUNT_TYPE.EXPENSE],
    ),
  };
};
