import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  CURRENCIES_QUERY_KEY,
  PRIMARY_CURRENCY_QUERY_KEY,
} from '@/helpers/currency/constants.ts';
import { fetchCurrencies } from '@/helpers/currency/fetchCurrencies.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';
import { CREATE_BUDGET_ACCOUNT_FAILURE_REASON } from '@/modules/budget/constants/account.ts';
import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from '@/modules/budget/constants/appearance.ts';
import { BUDGET_ACCOUNTS_QUERY_KEY } from '@/modules/budget/constants/queries.ts';
import { defaultTransactionDate, todayIso } from '@/modules/budget/helpers/budgetMonth.ts';
import { createAccountVisibility } from '@/modules/budget/helpers/createAccountVisibility.ts';
import { createBudgetAccount } from '@/modules/budget/helpers/createBudgetAccount.ts';
import { validateCreateAccountForm } from '@/modules/budget/helpers/validateCreateAccountForm.ts';
import type {
  CreateAccountFormValues,
  UseCreateAccountFormParams,
} from '@/modules/budget/types/createAccountForm.ts';

const emptyValues = (currency: string): CreateAccountFormValues => ({
  name: '',
  icon: DEFAULT_ACCOUNT_ICON,
  color: DEFAULT_ACCOUNT_COLOR,
  initialBalance: 0,
  currency,
  isDebt: false,
});

export const useCreateAccountForm = ({
  opened,
  onClose,
  accountType,
  orderedIds,
  month,
}: UseCreateAccountFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: primary } = useQuery({
    queryKey: PRIMARY_CURRENCY_QUERY_KEY,
    queryFn: fetchPrimaryCurrency,
    enabled: opened,
  });

  const form = useForm<CreateAccountFormValues>({
    mode: 'controlled',
    initialValues: emptyValues(primary?.code ?? ''),
    validate: (values) => {
      const { showMoney } = createAccountVisibility(accountType, values.isDebt);
      const errors = validateCreateAccountForm(values, showMoney);

      return {
        name: errors.name ? t(errors.name) : null,
        currency: errors.currency ? t(errors.currency) : null,
      };
    },
  });

  const { showKind, showMoney } = createAccountVisibility(
    accountType,
    form.values.isDebt,
  );

  const { data: currencies = [] } = useQuery({
    queryKey: CURRENCIES_QUERY_KEY,
    queryFn: fetchCurrencies,
    enabled: opened && showMoney,
  });
  const currency = form.values.currency;

  useEffect(() => {
    if (!showMoney || currency || !primary?.code) {
      return;
    }

    form.setFieldValue('currency', primary.code);
  }, [currency, form, primary?.code, showMoney]);

  const handleSubmit = form.onSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.createAccount.errors.saveFailed');

    try {
      const result = await createBudgetAccount({
        accountType,
        values,
        openingBalanceDate: defaultTransactionDate({
          month,
          today: todayIso(),
        }),
        orderedIds,
      });

      if (result.ok) {
        await queryClient.invalidateQueries({
          queryKey: BUDGET_ACCOUNTS_QUERY_KEY,
        });
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
    showKind,
    showMoney,
    currencies,
    isSubmitting,
    saveError,
    handleSubmit,
  };
};
