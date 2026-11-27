import { AmountInCurrency } from '@/helpers/currency/types.ts';

export type AnalyticsAccountAmounts = {
  id: string;
  name: string;
  amounts: AmountInCurrency[];
};

export type AnalyticsBreakdownAmounts = {
  expenses: AnalyticsAccountAmounts[];
  incomes: AnalyticsAccountAmounts[];
};

export type AnalyticsRankItem = {
  id: string;
  name: string;
  amount: number;
  percent: string;
};

export type AnalyticsRankSide = {
  total: number | null;
  items: AnalyticsRankItem[];
};

export type AnalyticsBreakdownRank = {
  expenses: AnalyticsRankSide;
  incomes: AnalyticsRankSide;
};
