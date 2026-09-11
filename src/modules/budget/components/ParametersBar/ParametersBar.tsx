import { ActionIcon, Text } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import type { WalletCurrency } from '@/helpers/currency/types.ts';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { BudgetMonthTotals } from '@/modules/budget/types/budgetMonthTotals.ts';
import styles from './ParametersBar.module.css';

type ParametersBarProps = {
  month: string;
  onMonthChange: (month: string) => void;
  totals: BudgetMonthTotals;
};

const AMOUNT_PLACEHOLDER = '—';

const formatTotalAmount = (
  amount: number | null,
  currency: WalletCurrency | null,
): string =>
  amount !== null && currency
    ? formatWalletAmount(amount, currency)
    : AMOUNT_PLACEHOLDER;

const ParametersBar = ({ month, onMonthChange, totals }: ParametersBarProps) => {
  const { t } = useTranslation();

  const onDateChange = (value: string | null) => {
    if (value === null) {
      return;
    }

    onMonthChange(startOfMonth(value));
  };

  return (
    <header className={styles.bar}>
      <div className={styles.metrics}>
        <div className={styles.slot}>
          <Text size='sm' c='dimmed'>
            {t('budget.parameters.income')}
          </Text>
          <Text size='sm' c='green.6' className={styles.amount}>
            {formatTotalAmount(totals.income, totals.currency)}
          </Text>
        </div>

        <div className={styles.slot}>
          <Text size='sm' c='dimmed'>
            {t('budget.parameters.expenses')}
          </Text>
          <Text size='sm' c='red.6' className={styles.amount}>
            {formatTotalAmount(totals.expenses, totals.currency)}
          </Text>
        </div>

        <div className={styles.slot}>
          <Text size='sm' c='dimmed'>
            {t('budget.parameters.balance')}
          </Text>
          <Text size='sm' className={styles.amount}>
            {formatTotalAmount(totals.balance, totals.currency)}
          </Text>
        </div>
      </div>

      <div className={styles.controls}>
        <MonthPickerInput
          allowDeselect={false}
          aria-label={t('budget.parameters.month')}
          classNames={{
            root: styles.monthPicker,
            input: styles.monthInput,
          }}
          maxDate={todayIso()}
          onChange={onDateChange}
          size='sm'
          value={month}
          valueFormat='MMM YYYY'
        />

        <ActionIcon
          aria-label={t('budget.parameters.edit')}
          radius='md'
          size='input-sm'
          type='button'
          variant='default'
        >
          <PencilSimpleIcon aria-hidden size={18} />
        </ActionIcon>
      </div>
    </header>
  );
};

export default ParametersBar;
