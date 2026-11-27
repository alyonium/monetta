import { InsightGroupEntry } from '@/api/types.gen.ts';
import { sumToPrimary } from '@/helpers/currency/sumToPrimary.ts';
import { ExchangeRate, WalletCurrency } from '@/helpers/currency/types.ts';
import { endOfMonth } from '@/modules/budget/helpers/month/budgetMonth.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import {
  AnalyticsAccountAmounts,
  AnalyticsBreakdownAmounts,
  AnalyticsBreakdownRank,
  AnalyticsRankSide,
} from '@/modules/analytics/types/analyticsBreakdown.ts';

export const analyticsBreakdownPeriod = (
  range: AnalyticsRange,
): { start: string; end: string } => ({
  start: range.from,
  end: endOfMonth(range.to),
});

const addAmount = (
  accounts: Map<string, AnalyticsAccountAmounts>,
  id: string,
  name: string,
  amount: number,
  fromCode: string,
) => {
  const code = fromCode.toUpperCase();

  if (!id || !name.trim() || !code || !Number.isFinite(amount)) {
    return;
  }

  const next = { amount: Math.abs(amount), fromCode: code };
  const existing = accounts.get(id);

  if (existing) {
    existing.amounts.push(next);
    return;
  }

  accounts.set(id, {
    id,
    name: name.trim(),
    amounts: [next],
  });
};

const insightAmount = (difference: string | undefined): number | null => {
  if (difference === undefined || difference.trim() === '') {
    return null;
  }

  const amount = Number(difference);

  return Number.isFinite(amount) ? amount : null;
};

export const toInsightAccounts = (
  entries: InsightGroupEntry[],
): AnalyticsAccountAmounts[] => {
  const accounts = new Map<string, AnalyticsAccountAmounts>();

  entries.forEach((entry) => {
    const amount = insightAmount(entry.difference);

    if (amount === null) {
      return;
    }

    addAmount(
      accounts,
      entry.id ?? '',
      entry.name ?? '',
      amount,
      entry.currency_code ?? '',
    );
  });

  return [...accounts.values()];
};

export const toTaggedBreakdown = (
  transactions: AccountTransaction[],
): AnalyticsBreakdownAmounts => {
  const expenses = new Map<string, AnalyticsAccountAmounts>();
  const incomes = new Map<string, AnalyticsAccountAmounts>();

  transactions.forEach((transaction) => {
    if (transaction.type === 'withdrawal') {
      addAmount(
        expenses,
        transaction.destinationId,
        transaction.destinationName,
        transaction.amount,
        transaction.currencyCode,
      );
      return;
    }

    if (transaction.type === 'deposit') {
      addAmount(
        incomes,
        transaction.sourceId,
        transaction.sourceName,
        transaction.amount,
        transaction.currencyCode,
      );
    }
  });

  return {
    expenses: [...expenses.values()],
    incomes: [...incomes.values()],
  };
};

type RankedAmount = {
  id: string;
  name: string;
  amount: number;
};

const EMPTY_RANK_SIDE: AnalyticsRankSide = { total: null, items: [] };

const sharePercent = (amount: number, total: number): string => {
  const share = (amount / total) * 100;
  const whole = share.toFixed(0);

  if (whole !== '0') {
    return `${whole}%`;
  }

  const precise = share.toFixed(1);

  return precise === '0.0' ? '<0.1%' : `${precise}%`;
};

const convertRankAccounts = (
  accounts: AnalyticsAccountAmounts[],
  primaryCode: string,
  rates: ExchangeRate[],
): RankedAmount[] | null => {
  const converted: RankedAmount[] = [];

  for (const account of accounts) {
    const amount = sumToPrimary(account.amounts, primaryCode, rates);

    if (amount === null) {
      return null;
    }

    converted.push({ id: account.id, name: account.name, amount });
  }

  return converted;
};

const rankSide = (
  accounts: AnalyticsAccountAmounts[],
  primary: WalletCurrency | undefined,
  rates: ExchangeRate[] | undefined,
): AnalyticsRankSide => {
  const nonzero = accounts.filter((account) =>
    account.amounts.some((entry) => entry.amount !== 0),
  );
  const converted =
    primary && rates ? convertRankAccounts(nonzero, primary.code, rates) : null;

  if (!converted) {
    return EMPTY_RANK_SIDE;
  }

  const ranked = converted
    .filter((item) => item.amount !== 0)
    .sort((left, right) => right.amount - left.amount);
  const total = ranked.reduce((sum, item) => sum + item.amount, 0);

  return {
    total,
    items: ranked.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      percent: sharePercent(item.amount, total),
    })),
  };
};

export const rankAnalyticsBreakdown = (
  breakdown: AnalyticsBreakdownAmounts,
  primary: WalletCurrency | undefined,
  rates: ExchangeRate[] | undefined,
): AnalyticsBreakdownRank => ({
  expenses: rankSide(breakdown.expenses, primary, rates),
  incomes: rankSide(breakdown.incomes, primary, rates),
});
