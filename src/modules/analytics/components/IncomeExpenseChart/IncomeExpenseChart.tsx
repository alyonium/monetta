import { LineChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import AnalyticsStatus from '@/modules/analytics/components/AnalyticsStatus/AnalyticsStatus.tsx';
import {
  ANALYTICS_AMOUNT_PLACEHOLDER,
  formatAnalyticsAxisAmount,
} from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';
import { useAnalyticsChart } from '@/modules/analytics/hooks/useAnalyticsChart.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import styles from './IncomeExpenseChart.module.css';

type IncomeExpenseChartProps = {
  range: AnalyticsRange;
  tag: string | null;
};

const IncomeExpenseChart = ({ range, tag }: IncomeExpenseChartProps) => {
  const { t } = useTranslation();
  const { currency, isError, label, points, yAxisWidth } = useAnalyticsChart(
    range,
    tag,
  );

  if (points === undefined || !currency) {
    return (
      <div className={styles.status}>
        <AnalyticsStatus failed={isError} />
      </div>
    );
  }

  if (points === null) {
    return (
      <Text className={styles.empty} size='sm'>
        {ANALYTICS_AMOUNT_PLACEHOLDER}
      </Text>
    );
  }

  return (
    <div className={styles.chart}>
      <LineChart
        data={points}
        dataKey='month'
        gridAxis='xy'
        h='100%'
        lineChartProps={{ margin: { top: 8, right: 24, bottom: 0, left: 0 } }}
        series={[
          { name: 'incomes', color: 'green.6', label: t('analytics.incomes') },
          {
            name: 'expenses',
            color: 'red.6',
            label: t('analytics.expenses'),
          },
        ]}
        tooltipProps={{
          labelFormatter: (value) =>
            label(typeof value === 'string' ? value : ''),
        }}
        valueFormatter={(value) => formatWalletAmount(value, currency)}
        xAxisProps={{
          tickFormatter: (value: string) => label(String(value)),
        }}
        yAxisProps={{
          tickFormatter: (value: number) =>
            formatAnalyticsAxisAmount(value, currency),
          width: yAxisWidth,
        }}
      />
    </div>
  );
};

export default IncomeExpenseChart;
