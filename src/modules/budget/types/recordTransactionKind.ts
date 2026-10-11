import type { recordTransactionKindConfig } from '@/modules/budget/helpers/transactions/recordTransactionKind.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export type RecordTransactionKind = keyof typeof recordTransactionKindConfig;

export type RecordTransactionKindConfig =
  (typeof recordTransactionKindConfig)[RecordTransactionKind];

export type RecordTransactionDrop = {
  kind: RecordTransactionKind;
  source: BudgetAccount;
  destination: BudgetAccount;
};

export type RecordTransferDrop = {
  source: BudgetAccount;
  destination: BudgetAccount;
};
