import { AmountInCurrency } from '@/helpers/currency/types.ts';

export type AnalyticsChartMonthAmounts = {
  month: string;
  expenses: AmountInCurrency[];
  incomes: AmountInCurrency[];
};

export type AnalyticsChartPoint = {
  month: string;
  expenses: number;
  incomes: number;
};
