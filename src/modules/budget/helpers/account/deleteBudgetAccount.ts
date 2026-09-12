import { deleteAccount } from '@/api/sdk.gen.ts';
import type { DeleteBudgetAccountResult } from '@/modules/budget/types/deleteBudgetAccount.ts';

export const deleteBudgetAccount = async (
  id: string,
): Promise<DeleteBudgetAccountResult> => {
  let result;

  try {
    result = await deleteAccount({ path: { id } });
  } catch {
    return { ok: false };
  }

  if (result.response.ok) {
    return { ok: true };
  }

  return { ok: false };
};
