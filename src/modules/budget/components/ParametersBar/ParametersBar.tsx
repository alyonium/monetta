import { ActionIcon, Text } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/budgetMonth.ts';
import styles from './ParametersBar.module.css';

type ParametersBarProps = {
  month: string;
  onMonthChange: (month: string) => void;
};

const AMOUNT_PLACEHOLDER = '—';

const ParametersBar = ({ month, onMonthChange }: ParametersBarProps) => {
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
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.income')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>

        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.expenses')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>

        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.balance')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>
      </div>

      <div className={styles.controls}>
        <MonthPickerInput
          allowDeselect={false}
          classNames={{
            root: styles.monthPicker,
            label: styles.monthLabel,
            input: styles.monthInput,
          }}
          label={t('budget.parameters.month')}
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
