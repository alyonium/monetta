import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { createBudgetTransaction } from '@/modules/budget/helpers/transactions/createBudgetTransaction.ts';
import { invalidateTransactionQueries } from '@/modules/budget/helpers/transactions/invalidateTransactionQueries.ts';
import { initialRecordIncomeFormValues } from '@/modules/budget/helpers/transactions/initialRecordIncomeFormValues.ts';
import { toTransactionStoreBody } from '@/modules/budget/helpers/transactions/toTransactionStoreBody.ts';
import { validateRecordIncomeForm } from '@/modules/budget/helpers/transactions/validateRecordIncomeForm.ts';
import type {
  RecordIncomeFormValues,
  UseRecordIncomeFormParams,
} from '@/modules/budget/types/recordIncomeForm.ts';

export const useRecordIncomeForm = ({
  onClose,
  source,
  destination,
  incomeAccounts,
  currentAccounts,
  month,
}: UseRecordIncomeFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<RecordIncomeFormValues>({
    mode: 'controlled',
    initialValues: initialRecordIncomeFormValues(
      source.id,
      destination.id,
      month,
    ),
    validate: (values) => {
      const errors = validateRecordIncomeForm(values);

      return {
        incomeAccountId: errors.incomeAccountId
          ? t(errors.incomeAccountId)
          : null,
        currentAccountId: errors.currentAccountId
          ? t(errors.currentAccountId)
          : null,
        amount: errors.amount ? t(errors.amount) : null,
        date: errors.date ? t(errors.date) : null,
      };
    },
  });

  const selectedCurrent =
    currentAccounts.find(
      (account) => account.id === form.values.currentAccountId,
    ) ?? destination;
  const selectedIncome =
    incomeAccounts.find(
      (account) => account.id === form.values.incomeAccountId,
    ) ?? source;

  const handleSubmit = form.onSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.recordTransaction.errors.saveFailed');

    try {
      const result = await createBudgetTransaction(
        toTransactionStoreBody({
          type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
          sourceId: values.incomeAccountId,
          destinationId: values.currentAccountId,
          amount: Number(values.amount),
          currencyCode: selectedCurrent.currencyCode,
          date: values.date,
          description: values.description || selectedIncome.name,
          tags: values.tags,
        }),
      );

      if (result.ok) {
        await invalidateTransactionQueries(queryClient);
        onClose();
        return;
      }

      setSaveError(message);
    } catch (error) {
      console.error(error);
      setSaveError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    selectedCurrent,
    isSubmitting,
    saveError,
    handleSubmit,
  };
};
