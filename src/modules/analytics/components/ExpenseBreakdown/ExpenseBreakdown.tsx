import { DonutChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { formatAnalyticsAmount } from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';
import {
  DONUT_PADDING_ANGLE,
  DONUT_THICKNESS,
} from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
import { useExpenseBreakdownChart } from '@/modules/analytics/hooks/useExpenseBreakdownChart.ts';
import { AnalyticsRankSide } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import styles from './ExpenseBreakdown.module.css';

type ExpenseBreakdownProps = {
  accounts: BudgetAccountsByBlock | undefined;
  currency: WalletCurrency | null;
  side: AnalyticsRankSide;
};

const ExpenseBreakdown = ({
  accounts,
  currency,
  side,
}: ExpenseBreakdownProps) => {
  const { t } = useTranslation();
  const { chart, donutSize, ref, segments } = useExpenseBreakdownChart(
    accounts,
    currency,
    side,
  );

  return (
    <div className={styles.layout} ref={ref}>
      <div className={styles.chart}>
        {chart ? (
          <DonutChart
            chartLabel={formatAnalyticsAmount(side.total, chart.currency)}
            data={chart.segments}
            size={donutSize}
            styles={{
              label: {
                fill: 'var(--mantine-color-text)',
                fontSize: 'var(--mantine-font-size-sm)',
                fontWeight: 600,
              },
              tooltipItemData: {
                flexShrink: 0,
                whiteSpace: 'nowrap',
              },
            }}
            paddingAngle={DONUT_PADDING_ANGLE}
            strokeWidth={0}
            thickness={DONUT_THICKNESS}
            tooltipDataSource='segment'
            valueFormatter={(value) =>
              formatWalletAmount(value, chart.currency)
            }
          />
        ) : (
          <Text className={styles.total} fw={600} size='sm'>
            {formatAnalyticsAmount(side.total, currency)}
          </Text>
        )}
      </div>

      {side.items.length > 0 && (
        <div className={styles.legendSlot}>
          <ul
            aria-label={t('analytics.expenseBreakdown')}
            className={styles.legend}
          >
            {side.items.map((item, index) => (
              <li className={styles.item} key={item.id}>
                <span
                  aria-hidden
                  className={styles.swatch}
                  style={{ backgroundColor: segments[index].color }}
                />
                <Text className={styles.name} size='sm'>
                  {item.name}
                </Text>
                <Text className={styles.percent} size='sm'>
                  {item.percent}
                </Text>
                <Text className={styles.amount} size='sm'>
                  {formatAnalyticsAmount(item.amount, currency)}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
