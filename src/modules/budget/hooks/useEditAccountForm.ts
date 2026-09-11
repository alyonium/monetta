import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toAccountIconName } from '@/modules/budget/components/accountIcons.ts';
import {
  ACCOUNT_TYPE,
  CREATE_BUDGET_ACCOUNT_FAILURE_REASON,
} from '@/modules/budget/constants/account.ts';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants/appearance.ts';
import {
  ACCOUNT_TRANSACTIONS_QUERY_KEY,
  BUDGET_ACCOUNTS_QUERY_KEY,
} from '@/modules/budget/constants/queries.ts';
import { updateBudgetAccount } from '@/modules/budget/helpers/account/updateBudgetAccount.ts';
import { validateAccountName } from '@/modules/budget/helpers/account/validateAccountName.ts';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type {
  EditAccountFormValues,
  UseEditAccountFormParams,
} from '@/modules/budget/types/editAccountForm.ts';

const toInitialValues = (account: BudgetAccount): EditAccountFormValues => ({
  name: account.name,
  icon: toAccountIconName(account.icon),
  color: account.color ?? DEFAULT_ACCOUNT_COLOR,
  balance: account.balance,
});

export const useEditAccountForm = ({
  onClose,
  account,
}: UseEditAccountFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const showBalance = account.type === ACCOUNT_TYPE.CURRENT;

  const form = useForm<EditAccountFormValues>({
    mode: 'controlled',
    initialValues: toInitialValues(account),
    validate: (values) => {
      const nameError = validateAccountName(values.name);

      return {
        name: nameError ? t(nameError) : null,
      };
    },
  });

  const handleDiscard = () => {
    form.reset();
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.createAccount.errors.saveFailed');

    try {
      const result = await updateBudgetAccount({
        id: account.id,
        accountType: account.type,
        values,
        openingBalanceDate: todayIso(),
      });

      if (result.ok) {
        form.setInitialValues(values);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: BUDGET_ACCOUNTS_QUERY_KEY,
          }),
          queryClient.invalidateQueries({
            queryKey: [...ACCOUNT_TRANSACTIONS_QUERY_KEY, account.id],
          }),
        ]);
        onClose();
        return;
      }

      switch (result.reason) {
        case CREATE_BUDGET_ACCOUNT_FAILURE_REASON.NAME:
          form.setFieldError('name', message);
          return;
        case CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED:
          setSaveError(message);
          return;
        default: {
          const unexpectedReason: never = result.reason;
          setSaveError(message);
          void unexpectedReason;
        }
      }
    } catch (error) {
      console.error(error);
      setSaveError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    showBalance,
    isSubmitting,
    saveError,
    handleDiscard,
    handleSubmit,
  };
};
