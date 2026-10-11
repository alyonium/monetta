import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
import { isValidTransactionAmount } from '@/modules/budget/helpers/transactions/isValidTransactionAmount.ts';
import { transferCurrenciesDiffer } from '@/modules/budget/helpers/transactions/transferCurrenciesDiffer.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type {
  RecordTransferFormFieldErrors,
  RecordTransferFormValues,
} from '@/modules/budget/types/recordTransferForm.ts';

export const validateRecordTransferForm = (
  values: RecordTransferFormValues,
  accounts: BudgetAccount[],
): RecordTransferFormFieldErrors => {
  const errors: RecordTransferFormFieldErrors = {};
  const source = accountById(accounts, values.sourceAccountId);
  const destination = accountById(accounts, values.destinationAccountId);

  if (!source) {
    errors.sourceAccountId = 'budget.recordTransaction.errors.accountRequired';
  }

  if (!destination) {
    errors.destinationAccountId =
      'budget.recordTransaction.errors.accountRequired';
  } else if (values.sourceAccountId === values.destinationAccountId) {
    errors.destinationAccountId = 'budget.recordTransfer.errors.sameAccount';
  }

  if (!isValidTransactionAmount(values.amount)) {
    errors.amount = 'budget.recordTransaction.errors.amountRequired';
  }

  if (
    transferCurrenciesDiffer(source, destination) &&
    !isValidTransactionAmount(values.foreignAmount)
  ) {
    errors.foreignAmount = 'budget.recordTransaction.errors.amountRequired';
  }

  if (!values.date) {
    errors.date = 'budget.recordTransaction.errors.dateRequired';
  }

  return errors;
};
