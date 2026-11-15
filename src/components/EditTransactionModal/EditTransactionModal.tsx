import { Button, Group, Modal, Select, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '@/modules/budget/components/ConfirmModal/ConfirmModal.tsx';
import styles from '@/modules/budget/components/RecordTransactionModal/RecordTransactionModal.module.css';
import RecordTransactionFields from '@/modules/budget/components/RecordTransactionFields/RecordTransactionFields.tsx';
import { toAccountSelectData } from '@/modules/budget/helpers/account/toAccountSelectData.ts';
import { deleteBudgetTransaction } from '@/modules/budget/helpers/transactions/deleteBudgetTransaction.ts';
import { TRANSACTION_QUERY_KEYS } from '@/modules/budget/helpers/transactions/invalidateTransactionQueries.ts';
import { EditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { useEditTransactionForm } from '@/modules/budget/hooks/useEditTransactionForm.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import { RecordAmountField } from '@/modules/budget/types/recordAmountField.ts';

type EditTransactionModalProps = {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  transaction: EditableAccountTransaction;
  accounts: BudgetAccountsByBlock;
  stackId: string;
};

const EditTransactionModal = ({
  opened,
  onClose,
  onExitTransitionEnd,
  transaction,
  accounts,
  stackId,
}: EditTransactionModalProps) => {
  const { t } = useTranslation();
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const handleClose = () => {
    closeDelete();
    onClose();
  };

  const {
    form,
    sourceAccounts,
    destinationAccounts,
    currencyCode,
    foreignCurrencyCode,
    currenciesDiffer,
    isSubmitting,
    saveError,
    handleSubmit,
  } = useEditTransactionForm({
    onClose: handleClose,
    transaction,
    accounts,
  });

  const amounts: RecordAmountField[] = [
    {
      label: t(
        currenciesDiffer
          ? 'budget.recordTransfer.amountDebited'
          : 'budget.recordTransaction.amount',
      ),
      amount: form.values.amount,
      onAmountChange: (value) => form.setFieldValue('amount', value),
      error: form.errors.amount,
      currency: currencyCode,
    },
    ...(currenciesDiffer
      ? [
          {
            label: t('budget.recordTransfer.amountCredited'),
            amount: form.values.foreignAmount,
            onAmountChange: (value: number | string) =>
              form.setFieldValue('foreignAmount', value),
            error: form.errors.foreignAmount,
            currency: foreignCurrencyCode,
          },
        ]
      : []),
  ];

  return (
    <>
      <Modal
        stackId={stackId}
        opened={opened}
        onClose={handleClose}
        onExitTransitionEnd={onExitTransitionEnd}
        title={t('budget.editTransaction.title')}
        centered
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Select
            label={t('budget.editTransaction.from')}
            data={toAccountSelectData(sourceAccounts)}
            allowDeselect={false}
            searchable
            {...form.getInputProps('sourceAccountId')}
          />

          <Select
            label={t('budget.editTransaction.to')}
            data={toAccountSelectData(destinationAccounts)}
            allowDeselect={false}
            searchable
            {...form.getInputProps('destinationAccountId')}
          />

          <RecordTransactionFields
            amounts={amounts}
            date={form.values.date}
            onDateChange={(value) => form.setFieldValue('date', value)}
            dateError={form.errors.date}
            description={form.values.description}
            onDescriptionChange={(value) =>
              form.setFieldValue('description', value)
            }
            tags={form.values.tags}
            onTagsChange={(tags) => form.setFieldValue('tags', tags)}
            tagsEnabled={opened}
          />

          {saveError && (
            <Text c='red' size='sm'>
              {saveError}
            </Text>
          )}

          <Group className={styles.actions} justify='space-between'>
            <Button
              type='button'
              color='red'
              variant='light'
              disabled={isSubmitting}
              onClick={openDelete}
            >
              {t('budget.editTransaction.delete')}
            </Button>

            <Group>
              <Button type='button' variant='default' onClick={handleClose}>
                {t('budget.recordTransaction.cancel')}
              </Button>

              <Button type='submit' loading={isSubmitting}>
                {t('budget.recordTransaction.save')}
              </Button>
            </Group>
          </Group>
        </form>
      </Modal>

      <ConfirmModal
        stackId={`${stackId}-delete`}
        opened={opened && deleteOpened}
        onClose={closeDelete}
        message={t('budget.editTransaction.deleteConfirm')}
        confirmLabel={t('budget.editTransaction.delete')}
        errorMessage={t('budget.editTransaction.deleteFailed')}
        invalidateKeys={TRANSACTION_QUERY_KEYS}
        onConfirm={() => deleteBudgetTransaction(transaction.id)}
        onSuccess={handleClose}
      />
    </>
  );
};

export default EditTransactionModal;
