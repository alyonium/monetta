import { updateAccount } from '@/api/sdk.gen.ts';
import type { HideBudgetAccountResult } from '@/modules/budget/types/hideBudgetAccount.ts';

export const hideBudgetAccount = async (
  id: string,
  name: string,
): Promise<HideBudgetAccountResult> => {
  let result;

  try {
    result = await updateAccount({
      path: { id },
      body: { name, active: false },
    });
  } catch {
    return { ok: false };
  }

  if (result.response.ok) {
    return { ok: true };
  }

  return { ok: false };
};
