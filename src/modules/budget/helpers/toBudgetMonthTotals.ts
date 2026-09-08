import { sumToPrimary } from '@/helpers/currency/sumToPrimary.ts';
import type {
  AmountInCurrency,
  ExchangeRate,
  WalletCurrency,
} from '@/helpers/currency/types.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type {
  BudgetInsights,
  BudgetMonthTotals,
} from '@/modules/budget/types/budgetMonthTotals.ts';

const toAccountAmounts = (accounts: BudgetAccount[]): AmountInCurrency[] =>
  accounts.map((account) => ({
    amount: account.balance,
    fromCode: account.currencyCode,
  }));

export const toBudgetMonthTotals = ({
  insights,
  currentAccounts,
  primary,
  rates,
}: {
  insights: BudgetInsights | undefined;
  currentAccounts: BudgetAccount[] | undefined;
  primary: WalletCurrency | undefined;
  rates: ExchangeRate[] | undefined;
}): BudgetMonthTotals => {
  if (!primary || rates === undefined) {
    return {
      income: null,
      expenses: null,
      balance: null,
      currency: null,
    };
  }

  return {
    income: insights
      ? sumToPrimary(insights.income, primary.code, rates)
      : null,
    expenses: insights
      ? sumToPrimary(insights.expenses, primary.code, rates)
      : null,
    balance: currentAccounts
      ? sumToPrimary(toAccountAmounts(currentAccounts), primary.code, rates)
      : null,
    currency: primary,
  };
};
