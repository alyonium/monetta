import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { accountById } from '@/modules/budget/helpers/account/accountById.ts';
import {
  editTransactionAccounts,
  editTransactionCurrencies,
} from '@/modules/budget/helpers/transactions/editTransactionAccounts.ts';
import { initialEditTransactionFormValues } from '@/modules/budget/helpers/transactions/initialEditTransactionFormValues.ts';
import { invalidateTransactionQueries } from '@/modules/budget/helpers/transactions/invalidateTransactionQueries.ts';
import { EditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { toTransactionUpdateBody } from '@/modules/budget/helpers/transactions/toTransactionUpdateBody.ts';
import { updateBudgetTransaction } from '@/modules/budget/helpers/transactions/updateBudgetTransaction.ts';
import { validateRecordTransactionForm } from '@/modules/budget/helpers/transactions/validateRecordTransactionForm.ts';
import { validateRecordTransferForm } from '@/modules/budget/helpers/transactions/validateRecordTransferForm.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import {
  RecordTransferFormFieldErrors,
  RecordTransferFormValues,
} from '@/modules/budget/types/recordTransferForm.ts';

type UseEditTransactionFormParams = {
  onClose: () => void;
  transaction: EditableAccountTransaction;
  accounts: BudgetAccountsByBlock;
};

const toRecordFormErrors = (
  errors: RecordTransferFormFieldErrors,
  t: ReturnType<typeof useTranslation>['t'],
) => ({
  sourceAccountId: errors.sourceAccountId ? t(errors.sourceAccountId) : null,
  destinationAccountId: errors.destinationAccountId
    ? t(errors.destinationAccountId)
    : null,
  amount: errors.amount ? t(errors.amount) : null,
  foreignAmount: errors.foreignAmount ? t(errors.foreignAmount) : null,
  date: errors.date ? t(errors.date) : null,
});

export const useEditTransactionForm = ({
  onClose,
  transaction,
  accounts,
}: UseEditTransactionFormParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { sourceAccounts, destinationAccounts } = editTransactionAccounts(
    transaction.type,
    accounts,
  );
  const isTransfer = transaction.type === FIREFLY_TRANSACTION_TYPE.TRANSFER;

  const form = useForm<RecordTransferFormValues>({
    mode: 'controlled',
    initialValues: initialEditTransactionFormValues(transaction),
    validate: (values) =>
      toRecordFormErrors(
        isTransfer
          ? validateRecordTransferForm(values, sourceAccounts)
          : validateRecordTransactionForm(
              values,
              sourceAccounts,
              destinationAccounts,
            ),
        t,
      ),
  });

  const selectedSource = accountById(
    sourceAccounts,
    form.values.sourceAccountId,
  );
  const selectedDestination = accountById(
    destinationAccounts,
    form.values.destinationAccountId,
  );
  const currencies = editTransactionCurrencies(
    transaction.type,
    selectedSource,
    selectedDestination,
  );

  const handleSubmit = form.onSubmit(async (values) => {
    const source = accountById(sourceAccounts, values.sourceAccountId);
    const destination = accountById(
      destinationAccounts,
      values.destinationAccountId,
    );
    const nextCurrencies = editTransactionCurrencies(
      transaction.type,
      source,
      destination,
    );

    if (!source || !destination || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    const message = t('budget.recordTransaction.errors.saveFailed');

    try {
      const result = await updateBudgetTransaction(
        transaction.id,
        toTransactionUpdateBody({
          journalId: transaction.journalId,
          type: transaction.type,
          sourceId: source.id,
          destinationId: destination.id,
          amount: Number(values.amount),
          currencyCode: nextCurrencies.currencyCode,
          foreign: nextCurrencies.currenciesDiffer
            ? {
                amount: Number(values.foreignAmount),
                currencyCode: nextCurrencies.foreignCurrencyCode,
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
    sourceAccounts,
    destinationAccounts,
    currencyCode: currencies.currencyCode,
    foreignCurrencyCode: currencies.foreignCurrencyCode,
    currenciesDiffer: currencies.currenciesDiffer,
    isSubmitting,
    saveError,
    handleSubmit,
  };
};
