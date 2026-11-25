import { useTranslation } from 'react-i18next';
import {
  ANALYTICS_MONTH_LABEL_KEYS,
  ANALYTICS_MONTHS,
} from '@/modules/analytics/constants/analytics.ts';

export const useAnalyticsBoundFields = (
  value: string,
  today: string,
  onChange: (value: string) => void,
) => {
  const { t } = useTranslation();
  const year = value.slice(0, 4);
  const month = value.slice(5, 7);
  const months = ANALYTICS_MONTHS.map((item, index) => ({
    value: item,
    label: t(ANALYTICS_MONTH_LABEL_KEYS[index]),
    disabled: `${year}-${item}-01` > today,
  }));

  const onYearChange = (nextYear: string | null) => {
    if (nextYear === null) {
      return;
    }

    onChange(`${nextYear}-${month}-01`);
  };

  const onMonthChange = (nextMonth: string | null) => {
    if (nextMonth === null) {
      return;
    }

    onChange(`${year}-${nextMonth}-01`);
  };

  return { month, months, onMonthChange, onYearChange, year };
};
