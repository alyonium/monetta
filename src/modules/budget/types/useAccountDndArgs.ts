import { RecordDrop } from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export type UseAccountDndArgs = {
  editing: boolean;
  month: string;
  accounts: BudgetAccountsByBlock | undefined;
  onDrop: (drop: RecordDrop) => void;
};
