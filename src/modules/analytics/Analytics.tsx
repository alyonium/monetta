import { SegmentedControl, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AnalyticsFilters from '@/modules/analytics/components/AnalyticsFilters/AnalyticsFilters.tsx';
import AnalyticsRankList from '@/modules/analytics/components/AnalyticsRankList/AnalyticsRankList.tsx';
import AnalyticsStatus from '@/modules/analytics/components/AnalyticsStatus/AnalyticsStatus.tsx';
import DiagramMonthPager from '@/modules/analytics/components/DiagramMonthPager/DiagramMonthPager.tsx';
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
import { donutSizeForWidth } from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
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
  const { ref: diagramRef, width: diagramWidth } =
    useElementSize<HTMLDivElement>();
  const diagram = view === ANALYTICS_VIEW.DIAGRAM;
  const donutSize = donutSizeForWidth(diagramWidth);

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
        {diagram ? (
          <DiagramMonthPager
            onRangeChange={setDiagramRange}
            range={range}
            today={today}
          >
            <div
              className={styles.diagramFrame}
              ref={diagramRef}
              style={{ height: donutSize }}
            >
              {ranked ? (
                <ExpenseBreakdown
                  accounts={accounts}
                  currency={currency}
                  donutSize={donutSize}
                  side={ranked.expenses}
                />
              ) : (
                <AnalyticsStatus failed={isError} />
              )}
            </div>
          </DiagramMonthPager>
        ) : (
          !ranked && (
            <div className={styles.status}>
              <AnalyticsStatus failed={isError} />
            </div>
          )
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
        {ranked ? (
          <AnalyticsRankList
            category={category}
            currency={currency}
            items={ranked[category].items}
            label={t(`analytics.${category}`)}
          />
        ) : (
          !isError && (
            <div className={styles.rankStatus}>
              <AnalyticsStatus failed={false} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Analytics;
