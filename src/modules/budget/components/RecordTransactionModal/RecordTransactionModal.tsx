import { Button, Group, Modal, Select, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import RecordTransactionFields from '@/modules/budget/components/RecordTransactionFields/RecordTransactionFields.tsx';
import { toAccountSelectData } from '@/modules/budget/helpers/account/toAccountSelectData.ts';
import { recordTransactionKindConfig } from '@/modules/budget/helpers/transactions/recordTransactionKind.ts';
import { useRecordTransactionForm } from '@/modules/budget/hooks/useRecordTransactionForm.ts';
import type { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import type { RecordAmountField } from '@/modules/budget/types/recordAmountField.ts';
import type { RecordTransactionDrop } from '@/modules/budget/types/recordTransactionKind.ts';
import styles from './RecordTransactionModal.module.css';

type RecordTransactionModalProps = {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  drop: RecordTransactionDrop;
  accounts: BudgetAccountsByBlock;
  month: string;
};

const RecordTransactionModal = ({
  opened,
  onClose,
  onExitTransitionEnd,
  drop,
  accounts,
  month,
}: RecordTransactionModalProps) => {
  const { t } = useTranslation();
  const config = recordTransactionKindConfig[drop.kind];
  const sourceAccounts = accounts[config.source.accountType];
  const destinationAccounts = accounts[config.destination.accountType];
  const { form, currencyCode, isSubmitting, saveError, handleSubmit } =
    useRecordTransactionForm({
      onClose,
      config,
      sourceAccounts,
      destinationAccounts,
      sourceId: drop.source.id,
      destinationId: drop.destination.id,
      month,
    });

  const amounts: RecordAmountField[] = [
    {
      label: t('budget.recordTransaction.amount'),
      amount: form.values.amount,
      onAmountChange: (value) => form.setFieldValue('amount', value),
      error: form.errors.amount,
      currency: currencyCode,
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExitTransitionEnd}
      title={t(config.titleKey)}
      centered
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Select
          label={t(config.source.labelKey)}
          data={toAccountSelectData(sourceAccounts)}
          allowDeselect={false}
          searchable
          {...form.getInputProps('sourceAccountId')}
        />

        <Select
          label={t(config.destination.labelKey)}
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

export default RecordTransactionModal;
