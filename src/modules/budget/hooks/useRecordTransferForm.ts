import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
import { createBudgetTransaction } from '@/modules/budget/helpers/transactions/createBudgetTransaction.ts';
import { initialRecordTransferFormValues } from '@/modules/budget/helpers/transactions/initialRecordTransferFormValues.ts';
import { invalidateTransactionQueries } from '@/modules/budget/helpers/transactions/invalidateTransactionQueries.ts';
import { toTransactionStoreBody } from '@/modules/budget/helpers/transactions/toTransactionStoreBody.ts';
import { transferCurrenciesDiffer } from '@/modules/budget/helpers/transactions/transferCurrenciesDiffer.ts';
import { validateRecordTransferForm } from '@/modules/budget/helpers/transactions/validateRecordTransferForm.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type { RecordTransferFormValues } from '@/modules/budget/types/recordTransferForm.ts';

type UseRecordTransferFormParams = {
  onClose: () => void;
  accounts: BudgetAccount[];
  sourceId: string;
  destinationId: string;
  month: string;
};

export const useRecordTransferForm = ({
  onClose,
  accounts,
  sourceId,
  destinationId,
  month,
}: UseRecordTransferFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<RecordTransferFormValues>({
    mode: 'controlled',
    initialValues: initialRecordTransferFormValues(
      sourceId,
      destinationId,
      month,
    ),
    validate: (values) => {
      const errors = validateRecordTransferForm(values, accounts);

      return {
        sourceAccountId: errors.sourceAccountId
          ? t(errors.sourceAccountId)
          : null,
        destinationAccountId: errors.destinationAccountId
          ? t(errors.destinationAccountId)
          : null,
        amount: errors.amount ? t(errors.amount) : null,
        foreignAmount: errors.foreignAmount ? t(errors.foreignAmount) : null,
        date: errors.date ? t(errors.date) : null,
      };
    },
  });

  const sourceAccount = accountById(accounts, form.values.sourceAccountId);

  const destinationAccount = accountById(
    accounts,
    form.values.destinationAccountId,
  );

  const handleSubmit = form.onSubmit(async (values) => {
    const source = accountById(accounts, values.sourceAccountId);
    const destination = accountById(accounts, values.destinationAccountId);
    const currenciesDiffer = transferCurrenciesDiffer(source, destination);

    if (
      !source ||
      !destination ||
      source.id === destination.id ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.recordTransaction.errors.saveFailed');

    try {
      const result = await createBudgetTransaction(
        toTransactionStoreBody({
          type: FIREFLY_TRANSACTION_TYPE.TRANSFER,
          sourceId: source.id,
          destinationId: destination.id,
          amount: Number(values.amount),
          currencyCode: source.currencyCode,
          foreign: currenciesDiffer
            ? {
                amount: Number(values.foreignAmount),
                currencyCode: destination.currencyCode,
              }
            : undefined,
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
    sourceCurrencyCode: sourceAccount?.currencyCode ?? '',
    destinationCurrencyCode: destinationAccount?.currencyCode ?? '',
    currenciesDiffer: transferCurrenciesDiffer(
      sourceAccount,
      destinationAccount,
    ),
    isSubmitting,
    saveError,
    handleSubmit,
  };
};
