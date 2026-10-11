import { Button, Group, Modal, Select, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from '@/modules/budget/components/RecordTransactionModal/RecordTransactionModal.module.css';
import RecordTransactionFields from '@/modules/budget/components/RecordTransactionFields/RecordTransactionFields.tsx';
import { toAccountSelectData } from '@/modules/budget/helpers/account/toAccountSelectData.ts';
import { useRecordTransferForm } from '@/modules/budget/hooks/useRecordTransferForm.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type { RecordAmountField } from '@/modules/budget/types/recordAmountField.ts';
import type { RecordTransferDrop } from '@/modules/budget/types/recordTransactionKind.ts';

type RecordTransferModalProps = {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  drop: RecordTransferDrop;
  accounts: BudgetAccount[];
  month: string;
};

const RecordTransferModal = ({
  opened,
  onClose,
  onExitTransitionEnd,
  drop,
  accounts,
  month,
}: RecordTransferModalProps) => {
  const { t } = useTranslation();
  const {
    form,
    sourceCurrencyCode,
    destinationCurrencyCode,
    currenciesDiffer,
    isSubmitting,
    saveError,
    handleSubmit,
  } = useRecordTransferForm({
    onClose,
    accounts,
    sourceId: drop.source.id,
    destinationId: drop.destination.id,
    month,
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
      currency: sourceCurrencyCode,
    },
    ...(currenciesDiffer
      ? [
          {
            label: t('budget.recordTransfer.amountCredited'),
            amount: form.values.foreignAmount,
            onAmountChange: (value: number | string) =>
              form.setFieldValue('foreignAmount', value),
            error: form.errors.foreignAmount,
            currency: destinationCurrencyCode,
          },
        ]
      : []),
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExitTransitionEnd}
      title={t('budget.recordTransfer.title')}
      centered
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Select
          label={t('budget.recordTransfer.from')}
          data={toAccountSelectData(accounts)}
          allowDeselect={false}
          searchable
          {...form.getInputProps('sourceAccountId')}
        />

        <Select
          label={t('budget.recordTransfer.to')}
          data={toAccountSelectData(accounts)}
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

        <Group className={styles.actions} justify='flex-end'>
          <Button type='button' variant='default' onClick={onClose}>
            {t('budget.recordTransaction.cancel')}
          </Button>

          <Button type='submit' loading={isSubmitting}>
            {t('budget.recordTransaction.save')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default RecordTransferModal;
