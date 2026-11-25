import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAnalyticsBoundFields } from '@/modules/analytics/hooks/useAnalyticsBoundFields.ts';
import styles from './AnalyticsBoundFields.module.css';

type AnalyticsBoundFieldsProps = {
  groupLabel: string;
  value: string;
  today: string;
  years: string[];
  onChange: (value: string) => void;
};

const AnalyticsBoundFields = ({
  groupLabel,
  value,
  today,
  years,
  onChange,
}: AnalyticsBoundFieldsProps) => {
  const { t } = useTranslation();
  const { month, months, onMonthChange, onYearChange, year } =
    useAnalyticsBoundFields(value, today, onChange);

  return (
    <div className={styles.pair}>
      <Select
        allowDeselect={false}
        data={years}
        label={`${groupLabel} ${t('analytics.year')}`}
        onChange={onYearChange}
        size='xs'
        value={year}
      />

      <Select
        allowDeselect={false}
        data={months}
        label={`${groupLabel} ${t('analytics.month')}`}
        onChange={onMonthChange}
        size='xs'
        value={month}
      />
    </div>
  );
};

export default AnalyticsBoundFields;
