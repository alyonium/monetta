import { storeTransaction } from '@/api/sdk.gen.ts';
import type { TransactionStoreWritable } from '@/api/types.gen.ts';
import type { CreateBudgetTransactionResult } from '@/modules/budget/types/createBudgetTransaction.ts';

export const createBudgetTransaction = async (
  body: TransactionStoreWritable,
): Promise<CreateBudgetTransactionResult> => {
  let result;

  try {
    result = await storeTransaction({ body });
  } catch {
    return { ok: false };
  }

  if (result.response.ok && result.data?.data?.id) {
    return { ok: true };
  }

  return { ok: false };
};
