import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import {
  CURRENCIES_QUERY_KEY,
  PRIMARY_CURRENCY_QUERY_KEY,
} from '@/helpers/currency/constants.ts';
import { fetchCurrencies } from '@/helpers/currency/fetchCurrencies.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';
import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from '@/modules/budget/constants.ts';
import { createAccountVisibility } from '@/modules/budget/helpers/createAccountVisibility.ts';
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
  accountType,
}: UseCreateAccountFormParams) => {
  const { data: primary } = useQuery({
    queryKey: PRIMARY_CURRENCY_QUERY_KEY,
    queryFn: fetchPrimaryCurrency,
    enabled: opened,
  });

  const form = useForm<CreateAccountFormValues>({
    mode: 'controlled',
    initialValues: emptyValues(primary?.code ?? ''),
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

  return { form, showKind, showMoney, currencies };
};
