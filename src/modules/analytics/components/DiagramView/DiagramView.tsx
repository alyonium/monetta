import { useElementSize } from '@mantine/hooks';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import AnalyticsStatus from '@/modules/analytics/components/AnalyticsStatus/AnalyticsStatus.tsx';
import DiagramMonthPager from '@/modules/analytics/components/DiagramMonthPager/DiagramMonthPager.tsx';
import ExpenseBreakdown from '@/modules/analytics/components/ExpenseBreakdown/ExpenseBreakdown.tsx';
import { donutSizeForWidth } from '@/modules/analytics/helpers/expenseBreakdownChart.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import { AnalyticsBreakdownRank } from '@/modules/analytics/types/analyticsBreakdown.ts';
import { BudgetAccountsByBlock } from '@/modules/budget/types/budgetAccount.ts';
import styles from './DiagramView.module.css';

type DiagramViewProps = {
  accounts: BudgetAccountsByBlock | undefined;
  currency: WalletCurrency | null;
  failed: boolean;
  onRangeChange: (range: AnalyticsRange) => void;
  range: AnalyticsRange;
  ranked: AnalyticsBreakdownRank | null;
  today: string;
};

const DiagramView = ({
  accounts,
  currency,
  failed,
  onRangeChange,
  range,
  ranked,
  today,
}: DiagramViewProps) => {
  const { ref, width } = useElementSize<HTMLDivElement>();
  const donutSize = donutSizeForWidth(width);
  const breakdown = (
    <div className={styles.frame} ref={ref} style={{ height: donutSize }}>
      {ranked ? (
        <ExpenseBreakdown
          accounts={accounts}
          currency={currency}
          donutSize={donutSize}
          side={ranked.expenses}
        />
      ) : (
        <AnalyticsStatus failed={failed} />
      )}
    </div>
  );

  if (failed) {
    return breakdown;
  }

  return (
    <DiagramMonthPager
      onRangeChange={onRangeChange}
      range={range}
      today={today}
    >
      {breakdown}
    </DiagramMonthPager>
  );
};

export default DiagramView;
