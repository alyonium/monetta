import { deleteTransaction } from '@/api/sdk.gen.ts';
import { CreateBudgetTransactionResult } from '@/modules/budget/types/createBudgetTransaction.ts';

export const deleteBudgetTransaction = async (
  groupId: string,
): Promise<CreateBudgetTransactionResult> => {
  let result;

  try {
    result = await deleteTransaction({ path: { id: groupId } });
  } catch {
    return { ok: false };
  }

  if (result.response.ok) {
    return { ok: true };
  }

  return { ok: false };
};
