import { DonutChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { formatAnalyticsAmount } from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';
import {
  DONUT_CORNER_RADIUS,
  DONUT_PADDING_ANGLE,
  DONUT_THICKNESS,
  toExpenseBreakdownChart,
} from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
import { AnalyticsRankSide } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import styles from './ExpenseBreakdown.module.css';

type ExpenseBreakdownProps = {
  accounts: BudgetAccountsByBlock | undefined;
  currency: WalletCurrency | null;
  donutSize: number;
  side: AnalyticsRankSide;
};

const ExpenseBreakdown = ({
  accounts,
  currency,
  donutSize,
  side,
}: ExpenseBreakdownProps) => {
  const { t } = useTranslation();
  const { chart, segments } = toExpenseBreakdownChart(
    accounts,
    currency,
    side,
  );

  return (
    <div className={styles.layout}>
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
            pieProps={{ cornerRadius: DONUT_CORNER_RADIUS }}
            strokeWidth={0}
            thickness={DONUT_THICKNESS}
            tooltipDataSource='segment'
            valueFormatter={(value) =>
              formatWalletAmount(value, chart.currency)
            }
          />
        ) : (
          <div
            className={styles.empty}
            style={{
              width: donutSize,
              height: donutSize,
              borderWidth: DONUT_THICKNESS,
            }}
          >
            <Text className={styles.total} fw={600} size='sm'>
              {formatAnalyticsAmount(side.total, currency)}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.legendSlot}>
        {side.items.length > 0 ? (
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
        ) : (
          <Text c='dimmed' className={styles.legendEmpty} size='sm'>
            {t('analytics.noLegend')}
          </Text>
        )}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
