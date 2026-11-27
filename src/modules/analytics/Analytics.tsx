import { SegmentedControl, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AnalyticsFilters from '@/modules/analytics/components/AnalyticsFilters/AnalyticsFilters.tsx';
import AnalyticsRankList from '@/modules/analytics/components/AnalyticsRankList/AnalyticsRankList.tsx';
import AnalyticsStatus from '@/modules/analytics/components/AnalyticsStatus/AnalyticsStatus.tsx';
import DiagramView from '@/modules/analytics/components/DiagramView/DiagramView.tsx';
import IncomeExpenseChart from '@/modules/analytics/components/IncomeExpenseChart/IncomeExpenseChart.tsx';
import {
  ANALYTICS_CATEGORY_DATA,
  ANALYTICS_VIEW,
  ANALYTICS_VIEW_DATA,
} from '@/modules/analytics/constants/analytics.ts';
import {
  formatAnalyticsPeriod,
  periodMonthLabels,
} from '@/modules/analytics/helpers/analyticsPeriod.ts';
import { useAnalyticsBreakdown } from '@/modules/analytics/hooks/useAnalyticsBreakdown.ts';
import { useAnalyticsFilters } from '@/modules/analytics/hooks/useAnalyticsFilters.ts';
import { startOfMonth } from '@/modules/budget/helpers/month/budgetMonth.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { t } = useTranslation();
  const {
    category,
    range,
    setCategory,
    setDiagramRange,
    setRangeBound,
    setTag,
    setView,
    tag,
    today,
    view,
  } = useAnalyticsFilters();
  const { data: accounts } = useBudgetAccounts(startOfMonth(today));
  const { currency, isError, ranked } = useAnalyticsBreakdown(range, tag);
  const diagram = view === ANALYTICS_VIEW.DIAGRAM;

  return (
    <div className={styles.page}>
      <SegmentedControl
        fullWidth
        data={ANALYTICS_VIEW_DATA.map(({ value, label }) => ({
          value,
          label: t(label),
        }))}
        onChange={setView}
        value={view}
      />

      <AnalyticsFilters
        onRangeChange={setRangeBound}
        onTagChange={setTag}
        range={range}
        tag={tag}
        today={today}
      />

      <div className={styles.heading}>
        <Text className={styles.title} fw={600} size='sm'>
          {diagram
            ? t('analytics.expenseBreakdown')
            : t('analytics.incomesVsExpenses')}
        </Text>

        <div className={styles.headingAside}>
          {!diagram && (
            <ul
              aria-label={t('analytics.incomesVsExpenses')}
              className={styles.seriesLegend}
            >
              <li className={styles.seriesItem}>
                <span aria-hidden className={styles.incomesMark} />
                <Text className={styles.seriesLabel} size='xs'>
                  {t('analytics.incomes')}
                </Text>
              </li>

              <li className={styles.seriesItem}>
                <span aria-hidden className={styles.expensesMark} />
                <Text className={styles.seriesLabel} size='xs'>
                  {t('analytics.expenses')}
                </Text>
              </li>
            </ul>
          )}

          <Text className={styles.period} size='xs'>
            {formatAnalyticsPeriod(range, periodMonthLabels(t))}
          </Text>
        </div>
      </div>

      <div className={styles.visualization}>
        {diagram ? (
          <DiagramView
            accounts={accounts}
            currency={currency}
            failed={isError}
            onRangeChange={setDiagramRange}
            range={range}
            ranked={ranked}
            today={today}
          />
        ) : (
          <IncomeExpenseChart range={range} tag={tag} />
        )}
      </div>

      {!isError && (
        <>
          <SegmentedControl
            fullWidth
            data={ANALYTICS_CATEGORY_DATA.map(({ value, label }) => ({
              value,
              label: t(label),
            }))}
            onChange={setCategory}
            value={category}
          />

          <div className={styles.rank}>
            {ranked ? (
              <AnalyticsRankList
                category={category}
                currency={currency}
                items={ranked[category].items}
                label={t(`analytics.${category}`)}
              />
            ) : (
              <div className={styles.rankStatus}>
                <AnalyticsStatus failed={false} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
