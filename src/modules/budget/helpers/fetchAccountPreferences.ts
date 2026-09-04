import { listPreference } from '@/api/sdk.gen.ts';
import type { PolymorphicProperty } from '@/api/types.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  ACCOUNT_APPEARANCE_PREFIX,
  ACCOUNT_ORDER_PREFIX,
  ACCOUNT_PREFERENCES_MISSING_ERROR,
  ACCOUNT_TYPE,
  PREFERENCES_PAGE_LIMIT,
} from '@/modules/budget/constants.ts';
import type {
  AccountAppearance,
  AccountPreferences,
  AccountType,
} from '@/modules/budget/types/budgetAccount.ts';

const isAccountType = (value: string): value is AccountType =>
  value === ACCOUNT_TYPE.INCOME ||
  value === ACCOUNT_TYPE.CURRENT ||
  value === ACCOUNT_TYPE.EXPENSE;

const emptyOrderByBlock = (): AccountPreferences['orderByBlock'] => ({
  [ACCOUNT_TYPE.INCOME]: [],
  [ACCOUNT_TYPE.CURRENT]: [],
  [ACCOUNT_TYPE.EXPENSE]: [],
});

const parseAppearance = (
  data: PolymorphicProperty,
): AccountAppearance | null => {
  if (typeof data !== 'string') {
    return null;
  }

  try {
    const parsed: AccountAppearance = JSON.parse(data);

    if (typeof parsed.icon !== 'string' || typeof parsed.color !== 'string') {
      return null;
    }

    return { icon: parsed.icon, color: parsed.color };
  } catch {
    return null;
  }
};

const parseOrder = (data: PolymorphicProperty): string[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((id): id is string => typeof id === 'string');
};

export const fetchAccountPreferences =
  async (): Promise<AccountPreferences> => {
    const items = await collectFireflyPages(
      (page) =>
        listPreference({
          query: { page, limit: PREFERENCES_PAGE_LIMIT },
        }),
      ACCOUNT_PREFERENCES_MISSING_ERROR,
    );

    const appearanceById: Record<string, AccountAppearance> = {};
    const orderByBlock = emptyOrderByBlock();

    items.forEach((item) => {
      const name = item.attributes?.name;
      const data = item.attributes?.data;

      if (!name || data === undefined) {
        return;
      }

      if (name.startsWith(ACCOUNT_APPEARANCE_PREFIX)) {
        const accountId = name.slice(ACCOUNT_APPEARANCE_PREFIX.length);
        const appearance = parseAppearance(data);

        if (accountId && appearance) {
          appearanceById[accountId] = appearance;
        }

        return;
      }

      if (name.startsWith(ACCOUNT_ORDER_PREFIX)) {
        const type = name.slice(ACCOUNT_ORDER_PREFIX.length).toUpperCase();

        if (isAccountType(type)) {
          orderByBlock[type] = parseOrder(data);
        }
      }
    });

    return { appearanceById, orderByBlock };
  };
