import { updateTransaction } from '@/api/sdk.gen.ts';
import type { TransactionUpdateWritable } from '@/api/types.gen.ts';
import type { CreateBudgetTransactionResult } from '@/modules/budget/types/createBudgetTransaction.ts';

export const updateBudgetTransaction = async (
  groupId: string,
  body: TransactionUpdateWritable,
): Promise<CreateBudgetTransactionResult> => {
  let result;

  try {
    result = await updateTransaction({ path: { id: groupId }, body });
  } catch {
    return { ok: false };
  }

  if (result.response.ok) {
    return { ok: true };
  }

  return { ok: false };
};
