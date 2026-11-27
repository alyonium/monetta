import { useElementSize } from '@mantine/hooks';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import {
  donutSizeForWidth,
  segmentColorById,
} from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
import { AnalyticsRankSide } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';

export const useExpenseBreakdownChart = (
  accounts: BudgetAccountsByBlock | undefined,
  currency: WalletCurrency | null,
  side: AnalyticsRankSide,
) => {
  const { ref, width } = useElementSize<HTMLDivElement>();
  const donutSize = donutSizeForWidth(width);
  const colors = segmentColorById(accounts, side.items);
  const segments = side.items.map((item) => ({
    name: item.name,
    value: item.amount,
    color: colors.get(item.id) as string,
  }));
  const chart = currency && segments.length > 0 ? { currency, segments } : null;

  return { chart, donutSize, ref, segments };
};
