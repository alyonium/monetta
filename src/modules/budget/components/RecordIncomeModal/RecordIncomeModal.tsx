import { Button, Group, Modal, Select, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import RecordTransactionFields from '@/modules/budget/components/RecordTransactionFields/RecordTransactionFields.tsx';
import { toAccountSelectData } from '@/modules/budget/helpers/account/toAccountSelectData.ts';
import { useRecordIncomeForm } from '@/modules/budget/hooks/useRecordIncomeForm.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './RecordIncomeModal.module.css';

type RecordIncomeModalProps = {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  source: BudgetAccount;
  destination: BudgetAccount;
  incomeAccounts: BudgetAccount[];
  currentAccounts: BudgetAccount[];
  month: string;
};

const RecordIncomeModal = ({
  opened,
  onClose,
  onExitTransitionEnd,
  source,
  destination,
  incomeAccounts,
  currentAccounts,
  month,
}: RecordIncomeModalProps) => {
  const { t } = useTranslation();
  const {
    form,
    selectedCurrent,
    isSubmitting,
    saveError,
    handleSubmit,
  } = useRecordIncomeForm({
    onClose,
    source,
    destination,
    incomeAccounts,
    currentAccounts,
    month,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExitTransitionEnd}
      title={t('budget.recordIncome.title')}
      centered
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Select
          label={t('budget.recordIncome.incomeAccount')}
          data={toAccountSelectData(incomeAccounts)}
          allowDeselect={false}
          searchable
          {...form.getInputProps('incomeAccountId')}
        />

        <Select
          label={t('budget.recordIncome.currentAccount')}
          data={toAccountSelectData(currentAccounts)}
          allowDeselect={false}
          searchable
          {...form.getInputProps('currentAccountId')}
        />

        <RecordTransactionFields
          amount={form.values.amount}
          onAmountChange={(value) => form.setFieldValue('amount', value)}
          amountError={form.errors.amount}
          currency={selectedCurrent.currencyCode}
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

export default RecordIncomeModal;
