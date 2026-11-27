import { describe, expect, it } from 'vitest';
import {
  ANALYTICS_RANGE_BOUND,
  DIAGRAM_MONTH_SWIPE,
} from '@/modules/analytics/constants/analytics.ts';
import {
  clampAnalyticsRange,
  defaultChartRange,
  defaultDiagramRange,
  diagramMonthDots,
  formatAnalyticsPeriod,
  shiftAnalyticsMonth,
  stepDiagramMonth,
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

describe('shiftAnalyticsMonth', () => {
  it('returns the first day of the shifted month', () => {
    expect(shiftAnalyticsMonth('2026-01-15', -1)).toBe('2025-12-01');
    expect(shiftAnalyticsMonth('2026-11-01', 1)).toBe('2026-12-01');
  });
});

describe('stepDiagramMonth', () => {
  it('steps to the previous month', () => {
    expect(
      stepDiagramMonth(
        range('2026-11-01', '2026-11-01'),
        DIAGRAM_MONTH_SWIPE.PREVIOUS,
        TODAY,
      ),
    ).toEqual(range('2026-10-01', '2026-10-01'));
  });

  it('steps to the next month', () => {
    expect(
      stepDiagramMonth(
        range('2026-10-01', '2026-10-01'),
        DIAGRAM_MONTH_SWIPE.NEXT,
        TODAY,
      ),
    ).toEqual(range('2026-11-01', '2026-11-01'));
  });

  it('steps across a year', () => {
    expect(
      stepDiagramMonth(
        range('2026-01-01', '2026-01-01'),
        DIAGRAM_MONTH_SWIPE.PREVIOUS,
        TODAY,
      ),
    ).toEqual(range('2025-12-01', '2025-12-01'));
  });

  it('does not open a future month', () => {
    expect(
      stepDiagramMonth(
        range('2026-11-01', '2026-11-01'),
        DIAGRAM_MONTH_SWIPE.NEXT,
        TODAY,
      ),
    ).toBeNull();
  });

  it('does not open a month before January 2000', () => {
    expect(
      stepDiagramMonth(
        range('2000-01-01', '2000-01-01'),
        DIAGRAM_MONTH_SWIPE.PREVIOUS,
        TODAY,
      ),
    ).toBeNull();
  });

  it('opens January 2000 from February', () => {
    expect(
      stepDiagramMonth(
        range('2000-02-01', '2000-02-01'),
        DIAGRAM_MONTH_SWIPE.PREVIOUS,
        TODAY,
      ),
    ).toEqual(range('2000-01-01', '2000-01-01'));
  });

  it('returns null when the range is longer than a month', () => {
    expect(
      stepDiagramMonth(
        range('2026-01-01', '2026-08-01'),
        DIAGRAM_MONTH_SWIPE.PREVIOUS,
        TODAY,
      ),
    ).toBeNull();
  });
});

describe('diagramMonthDots', () => {
  it('shows the previous month and the current month', () => {
    expect(diagramMonthDots(range('2026-11-01', '2026-11-01'), TODAY)).toEqual([
      range('2026-10-01', '2026-10-01'),
      range('2026-11-01', '2026-11-01'),
    ]);
  });

  it('shows the previous, current, and next months', () => {
    expect(diagramMonthDots(range('2026-10-01', '2026-10-01'), TODAY)).toEqual([
      range('2026-09-01', '2026-09-01'),
      range('2026-10-01', '2026-10-01'),
      range('2026-11-01', '2026-11-01'),
    ]);
  });

  it('omits the previous month on January 2000', () => {
    expect(diagramMonthDots(range('2000-01-01', '2000-01-01'), TODAY)).toEqual([
      range('2000-01-01', '2000-01-01'),
      range('2000-02-01', '2000-02-01'),
    ]);
  });

  it('shows only January 2000 when that month is current', () => {
    expect(
      diagramMonthDots(range('2000-01-01', '2000-01-01'), '2000-01-15'),
    ).toEqual([range('2000-01-01', '2000-01-01')]);
  });

  it('returns null when the range is longer than a month', () => {
    expect(
      diagramMonthDots(range('2026-01-01', '2026-08-01'), TODAY),
    ).toBeNull();
  });
});
