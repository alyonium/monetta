import { describe, expect, it } from 'vitest';
import { ANALYTICS_RANGE_BOUND } from '@/modules/analytics/constants/analytics.ts';
import {
  clampAnalyticsRange,
  defaultChartRange,
  defaultDiagramRange,
  formatAnalyticsPeriod,
} from '@/modules/analytics/helpers/analyticsPeriod.ts';
import {
  AnalyticsMonthLabels,
  AnalyticsRange,
} from '@/modules/analytics/types/analytics.ts';

const TODAY = '2026-11-25';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const satisfies AnalyticsMonthLabels;

const range = (from: string, to: string): AnalyticsRange => ({ from, to });

describe('defaultDiagramRange', () => {
  it('starts on the current month', () => {
    expect(defaultDiagramRange(TODAY)).toEqual(
      range('2026-11-01', '2026-11-01'),
    );
  });
});

describe('defaultChartRange', () => {
  it('starts in January and ends on the current month', () => {
    expect(defaultChartRange(TODAY)).toEqual(range('2026-01-01', '2026-11-01'));
  });
});

describe('clampAnalyticsRange', () => {
  it('moves To when From is later', () => {
    expect(
      clampAnalyticsRange(
        range('2026-01-01', '2026-08-01'),
        ANALYTICS_RANGE_BOUND.FROM,
        '2026-10-01',
        TODAY,
      ),
    ).toEqual(range('2026-10-01', '2026-10-01'));
  });

  it('moves From when To is earlier', () => {
    expect(
      clampAnalyticsRange(
        range('2026-06-01', '2026-11-01'),
        ANALYTICS_RANGE_BOUND.TO,
        '2026-03-01',
        TODAY,
      ),
    ).toEqual(range('2026-03-01', '2026-03-01'));
  });

  it('clamps a future month after the year changes', () => {
    expect(
      clampAnalyticsRange(
        range('2025-12-01', '2026-11-01'),
        ANALYTICS_RANGE_BOUND.FROM,
        '2026-12-01',
        TODAY,
      ),
    ).toEqual(range('2026-11-01', '2026-11-01'));
  });
});

describe('formatAnalyticsPeriod', () => {
  it('formats one month', () => {
    expect(
      formatAnalyticsPeriod(range('2026-11-01', '2026-11-01'), MONTH_LABELS),
    ).toBe('Nov 2026');
  });

  it('formats months in one year', () => {
    expect(
      formatAnalyticsPeriod(range('2026-01-01', '2026-08-01'), MONTH_LABELS),
    ).toBe('Jan - Aug 2026');
  });

  it('formats a range across years', () => {
    expect(
      formatAnalyticsPeriod(range('2025-12-01', '2026-01-01'), MONTH_LABELS),
    ).toBe('Dec 2025 - Jan 2026');
  });
});
