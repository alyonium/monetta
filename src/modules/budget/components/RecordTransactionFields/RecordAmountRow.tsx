import type { ReactNode } from 'react';
import { NumberInput, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from './RecordTransactionFields.module.css';

type RecordAmountRowProps = {
  label: string;
  amount: number | string;
  onAmountChange: (value: number | string) => void;
  amountError?: ReactNode;
  currency: string;
  autoFocus?: boolean;
};

const RecordAmountRow = ({
  label,
  amount,
  onAmountChange,
  amountError,
  currency,
  autoFocus = false,
}: RecordAmountRowProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.amountRow}>
      <NumberInput
        className={styles.amount}
        label={label}
        hideControls
        min={0}
        value={amount}
        error={amountError}
        onChange={onAmountChange}
        {...(autoFocus ? { 'data-autofocus': true } : {})}
      />

      <TextInput
        className={styles.currency}
        label={t('budget.recordTransaction.currency')}
        value={currency}
        readOnly
      />
    </div>
  );
};

export default RecordAmountRow;
