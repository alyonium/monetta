import type { FireflyTransactionType } from '@/modules/budget/constants/transactions.ts';

export type CreateBudgetTransactionResult = { ok: true } | { ok: false };

export type ToTransactionStoreBodyInput = {
  type: FireflyTransactionType;
  sourceId: string;
  destinationId: string;
  amount: number;
  currencyCode: string;
  date: string;
  description: string;
  tags: string[];
};
