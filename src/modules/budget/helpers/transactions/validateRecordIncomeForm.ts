import { isValidTransactionAmount } from '@/modules/budget/helpers/transactions/isValidTransactionAmount.ts';
import type {
  RecordIncomeFormFieldErrors,
  RecordIncomeFormValues,
} from '@/modules/budget/types/recordIncomeForm.ts';

export const validateRecordIncomeForm = (
  values: RecordIncomeFormValues,
): RecordIncomeFormFieldErrors => {
  const errors: RecordIncomeFormFieldErrors = {};

  if (!values.incomeAccountId) {
    errors.incomeAccountId =
      'budget.recordTransaction.errors.accountRequired';
  }

  if (!values.currentAccountId) {
    errors.currentAccountId =
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
