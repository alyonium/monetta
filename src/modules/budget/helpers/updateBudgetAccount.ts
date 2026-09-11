import { updateAccount } from '@/api/sdk.gen.ts';
import { CREATE_BUDGET_ACCOUNT_FAILURE_REASON } from '@/modules/budget/constants.ts';
import { hasNameError } from '@/modules/budget/helpers/hasNameError.ts';
import { toAccountUpdateBody } from '@/modules/budget/helpers/toAccountUpdateBody.ts';
import { writeAccountAppearance } from '@/modules/budget/helpers/writeAccountPreferences.ts';
import type { CreateBudgetAccountResult } from '@/modules/budget/types/createBudgetAccount.ts';
import type { UpdateBudgetAccountInput } from '@/modules/budget/types/editAccountForm.ts';

export const updateBudgetAccount = async ({
  id,
  accountType,
  values,
  openingBalanceDate,
}: UpdateBudgetAccountInput): Promise<CreateBudgetAccountResult> => {
  const body = toAccountUpdateBody({
    accountType,
    name: values.name,
    balance: values.balance,
    openingBalanceDate,
  });

  let result;

  try {
    result = await updateAccount({ path: { id }, body });
  } catch {
    return { ok: false, reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED };
  }

  if (!result.data?.data) {
    const error =
      result.error && 'errors' in result.error ? result.error : undefined;

    return {
      ok: false,
      reason: hasNameError(error)
        ? CREATE_BUDGET_ACCOUNT_FAILURE_REASON.NAME
        : CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED,
    };
  }

  await writeAccountAppearance(id, {
    icon: values.icon,
    color: values.color,
  }).catch(() => undefined);

  return { ok: true };
};
