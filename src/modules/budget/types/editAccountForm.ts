import type { AccountIconName } from '@/modules/budget/components/accountIcons.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';

export type EditAccountFormValues = {
  name: string;
  icon: AccountIconName;
  color: string;
  balance: number;
};

export type UseEditAccountFormParams = {
  onClose: () => void;
  account: BudgetAccount;
};

export type UpdateBudgetAccountInput = {
  id: string;
  accountType: AccountType;
  values: EditAccountFormValues;
  openingBalanceDate: string;
};
