import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
import { isValidTransactionAmount } from '@/modules/budget/helpers/transactions/isValidTransactionAmount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type {
  RecordTransactionFormFieldErrors,
  RecordTransactionFormValues,
} from '@/modules/budget/types/recordTransactionForm.ts';

export const validateRecordTransactionForm = (
  values: RecordTransactionFormValues,
  sourceAccounts: BudgetAccount[],
  destinationAccounts: BudgetAccount[],
): RecordTransactionFormFieldErrors => {
  const errors: RecordTransactionFormFieldErrors = {};

  if (!accountById(sourceAccounts, values.sourceAccountId)) {
    errors.sourceAccountId = 'budget.recordTransaction.errors.accountRequired';
  }

  if (!accountById(destinationAccounts, values.destinationAccountId)) {
    errors.destinationAccountId =
      'budget.recordTransaction.errors.accountRequired';
  }

  if (!isValidTransactionAmount(values.amount)) {
    errors.amount = 'budget.recordTransaction.errors.amountRequired';
  }

  if (!values.date) {
    errors.date = 'budget.recordTransaction.errors.dateRequired';
  }

  return errors;
};
