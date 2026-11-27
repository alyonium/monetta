import { useState } from 'react';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  ANALYTICS_CATEGORY,
  ANALYTICS_VIEW,
} from '@/modules/analytics/constants/analytics.ts';
import {
  clampAnalyticsRange,
  defaultChartRange,
  defaultDiagramRange,
} from '@/modules/analytics/helpers/analyticsPeriod.ts';
import {
  AnalyticsCategory,
  AnalyticsRange,
  AnalyticsRangeBound,
  AnalyticsView,
} from '@/modules/analytics/types/analytics.ts';

type AnalyticsFiltersState = {
  view: AnalyticsView;
  category: AnalyticsCategory;
  tag: string | null;
  ranges: Record<AnalyticsView, AnalyticsRange>;
  today: string;
};

const isAnalyticsView = (value: string): value is AnalyticsView =>
  value === ANALYTICS_VIEW.DIAGRAM || value === ANALYTICS_VIEW.CHART;

const isAnalyticsCategory = (value: string): value is AnalyticsCategory =>
  value === ANALYTICS_CATEGORY.EXPENSES || value === ANALYTICS_CATEGORY.INCOMES;

export const useAnalyticsFilters = () => {
  const [state, setState] = useState<AnalyticsFiltersState>(() => {
    const today = todayIso();

    return {
      view: ANALYTICS_VIEW.DIAGRAM,
      category: ANALYTICS_CATEGORY.EXPENSES,
      tag: null,
      ranges: {
        [ANALYTICS_VIEW.DIAGRAM]: defaultDiagramRange(today),
        [ANALYTICS_VIEW.CHART]: defaultChartRange(today),
      },
      today,
    };
  });

  const setView = (value: string) => {
    if (!isAnalyticsView(value)) {
      return;
    }

    setState((current) => ({ ...current, view: value }));
  };

  const setCategory = (value: string) => {
    if (!isAnalyticsCategory(value)) {
      return;
    }

    setState((current) => ({ ...current, category: value }));
  };

  const setTag = (tag: string | null) => {
    setState((current) => ({ ...current, tag }));
  };

  const setRangeBound = (bound: AnalyticsRangeBound, value: string) => {
    setState((current) => ({
      ...current,
      ranges: {
        ...current.ranges,
        [current.view]: clampAnalyticsRange(
          current.ranges[current.view],
          bound,
          value,
          current.today,
        ),
      },
    }));
  };

  const setDiagramRange = (range: AnalyticsRange) => {
    setState((current) => ({
      ...current,
      ranges: {
        ...current.ranges,
        [ANALYTICS_VIEW.DIAGRAM]: range,
      },
    }));
  };

  return {
    view: state.view,
    category: state.category,
    tag: state.tag,
    range: state.ranges[state.view],
    today: state.today,
    setView,
    setCategory,
    setTag,
    setRangeBound,
    setDiagramRange,
  };
};
