import type { ReactNode } from 'react';
import { TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import TagsField from '@/components/TagsField/TagsField.tsx';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { RecordAmountField } from '@/modules/budget/types/recordAmountField.ts';
import RecordAmountRow from './RecordAmountRow.tsx';

type RecordTransactionFieldsProps = {
  amounts: RecordAmountField[];
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
  amounts,
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
      {amounts.map((amount, index) => (
        <RecordAmountRow
          key={amount.label}
          label={amount.label}
          amount={amount.amount}
          onAmountChange={amount.onAmountChange}
          amountError={amount.error}
          currency={amount.currency}
          autoFocus={index === 0}
        />
      ))}

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
