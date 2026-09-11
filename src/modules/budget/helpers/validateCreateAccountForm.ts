import { validateAccountName } from '@/modules/budget/helpers/validateAccountName.ts';
import type {
  CreateAccountFormFieldErrors,
  CreateAccountFormValues,
} from '@/modules/budget/types/createAccountForm.ts';

export const validateCreateAccountForm = (
  values: Pick<CreateAccountFormValues, 'name' | 'currency'>,
  showMoney: boolean,
): CreateAccountFormFieldErrors => {
  const errors: CreateAccountFormFieldErrors = {};
  const nameError = validateAccountName(values.name);

  if (nameError) {
    errors.name = nameError;
  }

  if (showMoney && !values.currency) {
    errors.currency = 'budget.createAccount.errors.currencyRequired';
  }

  return errors;
};
