import type { AccountIconName } from '@/modules/budget/components/accountIcons.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

export type CreateAccountFormValues = {
  name: string;
  icon: AccountIconName;
  color: string;
  initialBalance: number;
  currency: string;
  isDebt: boolean;
};

export type UseCreateAccountFormParams = {
  opened: boolean;
  accountType: AccountType;
};
