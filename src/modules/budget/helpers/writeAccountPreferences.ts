import { updatePreference } from '@/api/sdk.gen.ts';
import {
  ACCOUNT_APPEARANCE_PREFIX,
  ACCOUNT_ORDER_PREFIX,
  ACCOUNT_PREFERENCE_WRITE_ERROR,
} from '@/modules/budget/constants.ts';
import type {
  AccountAppearance,
  AccountType,
} from '@/modules/budget/types/budgetAccount.ts';

export const writeAccountAppearance = async (
  accountId: string,
  appearance: AccountAppearance,
): Promise<AccountAppearance> => {
  try {
    const result = await updatePreference({
      path: { name: `${ACCOUNT_APPEARANCE_PREFIX}${accountId}` },
      body: {
        data: JSON.stringify({
          icon: appearance.icon,
          color: appearance.color,
        }),
      },
    });

    if (!result.data) {
      throw new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
    }

    return appearance;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
  }
};

export const writeAccountOrder = async (
  type: AccountType,
  ids: string[],
): Promise<string[]> => {
  try {
    const result = await updatePreference({
      path: { name: `${ACCOUNT_ORDER_PREFIX}${type.toLowerCase()}` },
      body: { data: ids },
    });

    if (!result.data) {
      throw new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
    }

    return ids;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
  }
};
