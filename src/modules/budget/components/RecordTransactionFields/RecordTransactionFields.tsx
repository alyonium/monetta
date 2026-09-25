import type { ReactNode } from 'react';
import { NumberInput, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import TagsField from '@/components/TagsField/TagsField.tsx';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import styles from './RecordTransactionFields.module.css';

type RecordTransactionFieldsProps = {
  amount: number | string;
  onAmountChange: (value: number | string) => void;
  amountError?: ReactNode;
  currency: string;
  date: string;
  onDateChange: (value: string) => void;
  dateError?: ReactNode;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  tagsEnabled?: boolean;
};

const RecordTransactionFields = ({
  amount,
  onAmountChange,
  amountError,
  currency,
  date,
  onDateChange,
  dateError,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  tagsEnabled = true,
}: RecordTransactionFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.amountRow}>
        <NumberInput
          className={styles.amount}
          label={t('budget.recordTransaction.amount')}
          data-autofocus
          hideControls
          min={0}
          value={amount}
          error={amountError}
          onChange={onAmountChange}
        />

        <TextInput
          className={styles.currency}
          label={t('budget.recordTransaction.currency')}
          value={currency}
          readOnly
        />
      </div>

      <DatePickerInput
        label={t('budget.recordTransaction.date')}
        value={date}
        onChange={(value) => onDateChange(value ?? '')}
        maxDate={todayIso()}
        valueFormat='D MMM YYYY'
        allowDeselect={false}
        error={dateError}
      />

      <TextInput
        label={t('budget.recordTransaction.description')}
        value={description}
        onChange={(event) => onDescriptionChange(event.currentTarget.value)}
      />

      <TagsField value={tags} onChange={onTagsChange} enabled={tagsEnabled} />
    </>
  );
};

export default RecordTransactionFields;
