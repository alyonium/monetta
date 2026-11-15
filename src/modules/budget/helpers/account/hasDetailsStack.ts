import { EditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export const hasDetailsStack = (
  detailsOpened: boolean,
  editAccount: BudgetAccount | null,
  editTransaction: EditableAccountTransaction | null,
): boolean => detailsOpened || editAccount !== null || editTransaction !== null;
