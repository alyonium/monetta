import {
  ANALYTICS_CATEGORY,
  ANALYTICS_RANGE_BOUND,
  ANALYTICS_VIEW,
} from '@/modules/analytics/constants/analytics.ts';

export type AnalyticsView =
  (typeof ANALYTICS_VIEW)[keyof typeof ANALYTICS_VIEW];

export type AnalyticsCategory =
  (typeof ANALYTICS_CATEGORY)[keyof typeof ANALYTICS_CATEGORY];

export type AnalyticsRangeBound =
  (typeof ANALYTICS_RANGE_BOUND)[keyof typeof ANALYTICS_RANGE_BOUND];

export type AnalyticsMonthLabels = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type AnalyticsRange = {
  from: string;
  to: string;
};
