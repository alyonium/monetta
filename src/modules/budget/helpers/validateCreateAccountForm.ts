import type {
  CreateAccountFormFieldErrors,
  CreateAccountFormValues,
} from '@/modules/budget/types/createAccountForm.ts';

export const validateCreateAccountForm = (
  values: Pick<CreateAccountFormValues, 'name' | 'currency'>,
  showMoney: boolean,
): CreateAccountFormFieldErrors => {
  const errors: CreateAccountFormFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'budget.createAccount.errors.nameRequired';
  }

  if (showMoney && !values.currency) {
    errors.currency = 'budget.createAccount.errors.currencyRequired';
  }

  return errors;
};
