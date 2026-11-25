import { Select } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TAGS_QUERY_KEY } from '@/helpers/tags/constants.ts';
import { fetchTags } from '@/helpers/tags/fetchTags.ts';
import AnalyticsBoundFields from '@/modules/analytics/components/AnalyticsBoundFields/AnalyticsBoundFields.tsx';
import {
  ANALYTICS_RANGE_BOUND,
  yearSelectData,
} from '@/modules/analytics/constants/analytics.ts';
import {
  AnalyticsRange,
  AnalyticsRangeBound,
} from '@/modules/analytics/types/analytics.ts';
import styles from './AnalyticsFilters.module.css';

type AnalyticsFiltersProps = {
  range: AnalyticsRange;
  tag: string | null;
  today: string;
  onRangeChange: (bound: AnalyticsRangeBound, value: string) => void;
  onTagChange: (tag: string | null) => void;
};

const AnalyticsFilters = ({
  range,
  tag,
  today,
  onRangeChange,
  onTagChange,
}: AnalyticsFiltersProps) => {
  const { t } = useTranslation();
  const { data: tags = [] } = useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: fetchTags,
  });
  const years = yearSelectData(today);

  return (
    <div className={styles.filters}>
      <div className={styles.dates}>
        <AnalyticsBoundFields
          groupLabel={t('analytics.from')}
          onChange={(value) => onRangeChange(ANALYTICS_RANGE_BOUND.FROM, value)}
          today={today}
          value={range.from}
          years={years}
        />

        <AnalyticsBoundFields
          groupLabel={t('analytics.to')}
          onChange={(value) => onRangeChange(ANALYTICS_RANGE_BOUND.TO, value)}
          today={today}
          value={range.to}
          years={years}
        />
      </div>

      <Select
        clearable
        data={tags}
        label={t('analytics.tag')}
        onChange={onTagChange}
        placeholder={t('analytics.allTags')}
        size='xs'
        value={tag}
      />
    </div>
  );
};

export default AnalyticsFilters;
