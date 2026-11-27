import { SegmentedControl, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AnalyticsFilters from '@/modules/analytics/components/AnalyticsFilters/AnalyticsFilters.tsx';
import AnalyticsRankList from '@/modules/analytics/components/AnalyticsRankList/AnalyticsRankList.tsx';
import ExpenseBreakdown from '@/modules/analytics/components/ExpenseBreakdown/ExpenseBreakdown.tsx';
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
    setRangeBound,
    setTag,
    setView,
    tag,
    today,
    view,
  } = useAnalyticsFilters();
  const { data: accounts } = useBudgetAccounts(startOfMonth(today));
  const { currency, isError, ranked } = useAnalyticsBreakdown(range, tag);
  const statusLabel = isError
    ? t('analytics.loadFailed')
    : t('analytics.loading');

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
        {diagram && (
          <Text className={styles.title} fw={600} size='sm'>
            {t('analytics.expenseBreakdown')}
          </Text>
        )}
        <Text className={styles.period} size='xs'>
          {formatAnalyticsPeriod(range, periodMonthLabels(t))}
        </Text>
      </div>

      <div className={styles.visualization}>
        {ranked ? (
          diagram && (
            <ExpenseBreakdown
              accounts={accounts}
              currency={currency}
              side={ranked.expenses}
            />
          )
        ) : (
          <Text c='dimmed' className={styles.status} size='sm'>
            {statusLabel}
          </Text>
        )}
      </div>

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
        {ranked && (
          <AnalyticsRankList
            category={category}
            currency={currency}
            items={ranked[category].items}
            label={t(`analytics.${category}`)}
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
