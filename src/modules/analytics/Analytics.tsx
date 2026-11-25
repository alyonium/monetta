import { SegmentedControl, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AnalyticsFilters from '@/modules/analytics/components/AnalyticsFilters/AnalyticsFilters.tsx';
import {
  ANALYTICS_CATEGORY_DATA,
  ANALYTICS_VIEW_DATA,
} from '@/modules/analytics/constants/analytics.ts';
import {
  formatAnalyticsPeriod,
  periodMonthLabels,
} from '@/modules/analytics/helpers/analyticsPeriod.ts';
import { useAnalyticsFilters } from '@/modules/analytics/hooks/useAnalyticsFilters.ts';
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

      <Text className={styles.period} size='xs'>
        {formatAnalyticsPeriod(range, periodMonthLabels(t))}
      </Text>

      <div className={styles.visualization} />

      <SegmentedControl
        fullWidth
        data={ANALYTICS_CATEGORY_DATA.map(({ value, label }) => ({
          value,
          label: t(label),
        }))}
        onChange={setCategory}
        value={category}
      />
    </div>
  );
};

export default Analytics;
