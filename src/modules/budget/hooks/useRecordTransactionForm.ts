import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
import { createBudgetTransaction } from '@/modules/budget/helpers/transactions/createBudgetTransaction.ts';
import { initialRecordTransactionFormValues } from '@/modules/budget/helpers/transactions/initialRecordTransactionFormValues.ts';
import { invalidateTransactionQueries } from '@/modules/budget/helpers/transactions/invalidateTransactionQueries.ts';
import {
  recordTransactionCurrencyAccount,
  type RecordTransactionKindConfig,
} from '@/modules/budget/helpers/transactions/recordTransactionKind.ts';
import { toTransactionStoreBody } from '@/modules/budget/helpers/transactions/toTransactionStoreBody.ts';
import { validateRecordTransactionForm } from '@/modules/budget/helpers/transactions/validateRecordTransactionForm.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type { RecordTransactionFormValues } from '@/modules/budget/types/recordTransactionForm.ts';

type UseRecordTransactionFormParams = {
  onClose: () => void;
  config: RecordTransactionKindConfig;
  sourceAccounts: BudgetAccount[];
  destinationAccounts: BudgetAccount[];
  sourceId: string;
  destinationId: string;
  month: string;
};

export const useRecordTransactionForm = ({
  onClose,
  config,
  sourceAccounts,
  destinationAccounts,
  sourceId,
  destinationId,
  month,
}: UseRecordTransactionFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<RecordTransactionFormValues>({
    mode: 'controlled',
    initialValues: initialRecordTransactionFormValues(
      sourceId,
      destinationId,
      month,
    ),
    validate: (values) => {
      const errors = validateRecordTransactionForm(
        values,
        sourceAccounts,
        destinationAccounts,
      );

      return {
        sourceAccountId: errors.sourceAccountId
          ? t(errors.sourceAccountId)
          : null,
        destinationAccountId: errors.destinationAccountId
          ? t(errors.destinationAccountId)
          : null,
        amount: errors.amount ? t(errors.amount) : null,
        date: errors.date ? t(errors.date) : null,
      };
    },
  });

  const currencyAccount = recordTransactionCurrencyAccount(
    config,
    accountById(sourceAccounts, form.values.sourceAccountId),
    accountById(destinationAccounts, form.values.destinationAccountId),
  );

  const handleSubmit = form.onSubmit(async (values) => {
    const sourceAccount = accountById(sourceAccounts, values.sourceAccountId);
    const destinationAccount = accountById(
      destinationAccounts,
      values.destinationAccountId,
    );
    const currency = recordTransactionCurrencyAccount(
      config,
      sourceAccount,
      destinationAccount,
    );

    if (!sourceAccount || !destinationAccount || !currency || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.recordTransaction.errors.saveFailed');

    try {
      const result = await createBudgetTransaction(
        toTransactionStoreBody({
          type: config.type,
          sourceId: sourceAccount.id,
          destinationId: destinationAccount.id,
          amount: Number(values.amount),
          currencyCode: currency.currencyCode,
          date: values.date,
          description: values.description,
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
    currencyCode: currencyAccount?.currencyCode ?? '',
    isSubmitting,
    saveError,
    handleSubmit,
  };
};
