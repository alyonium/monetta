import { storePreference, updatePreference } from '@/api/sdk.gen.ts';
import type { PolymorphicProperty } from '@/api/types.gen.ts';
import {
  ACCOUNT_APPEARANCE_PREFIX,
  ACCOUNT_ORDER_PREFIX,
  ACCOUNT_PREFERENCE_WRITE_ERROR,
} from '@/modules/budget/constants.ts';
import type {
  AccountAppearance,
  AccountType,
} from '@/modules/budget/types/budgetAccount.ts';

const writePreference = async (
  name: string,
  data: PolymorphicProperty,
): Promise<void> => {
  const updated = await updatePreference({
    path: { name },
    body: { data },
  });

  if (updated.data) {
    return;
  }

  if (updated.response.status === 404) {
    const created = await storePreference({
      body: { name, data },
    });

    if (created.data) {
      return;
    }
  }

  throw new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
};

export const writeAccountAppearance = async (
  accountId: string,
  appearance: AccountAppearance,
): Promise<AccountAppearance> => {
  try {
    await writePreference(
      `${ACCOUNT_APPEARANCE_PREFIX}${accountId}`,
      JSON.stringify({
        icon: appearance.icon,
        color: appearance.color,
      }),
    );

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
    await writePreference(`${ACCOUNT_ORDER_PREFIX}${type.toLowerCase()}`, ids);

    return ids;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(ACCOUNT_PREFERENCE_WRITE_ERROR);
  }
};
