import { storeAccount } from '@/api/sdk.gen.ts';
import type { ValidationErrorResponse } from '@/api/types.gen.ts';
import { CREATE_BUDGET_ACCOUNT_FAILURE_REASON } from '@/modules/budget/constants.ts';
import { toAccountStoreBody } from '@/modules/budget/helpers/toAccountStoreBody.ts';
import {
  writeAccountAppearance,
  writeAccountOrder,
} from '@/modules/budget/helpers/writeAccountPreferences.ts';
import type {
  CreateBudgetAccountInput,
  CreateBudgetAccountResult,
} from '@/modules/budget/types/createBudgetAccount.ts';

const hasNameError = (error: ValidationErrorResponse | undefined): boolean => {
  const names = error?.errors?.name;

  return Array.isArray(names) && names.length > 0;
};

export const createBudgetAccount = async ({
  accountType,
  values,
  openingBalanceDate,
  orderedIds,
}: CreateBudgetAccountInput): Promise<CreateBudgetAccountResult> => {
  const body = toAccountStoreBody({
    accountType,
    name: values.name,
    isDebt: values.isDebt,
    currency: values.currency,
    initialBalance: values.initialBalance,
    openingBalanceDate,
  });

  let result;

  try {
    result = await storeAccount({ body });
  } catch {
    return { ok: false, reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED };
  }

  const id = result.data?.data?.id?.trim();

  if (!id) {
    const error =
      result.error && 'errors' in result.error ? result.error : undefined;

    return {
      ok: false,
      reason: hasNameError(error)
        ? CREATE_BUDGET_ACCOUNT_FAILURE_REASON.NAME
        : CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED,
    };
  }

  await Promise.allSettled([
    writeAccountAppearance(id, {
      icon: values.icon,
      color: values.color,
    }),
    writeAccountOrder(accountType, [
      ...orderedIds.filter((item) => item !== id),
      id,
    ]),
  ]);

  return { ok: true };
};
