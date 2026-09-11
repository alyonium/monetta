import type { AccountUpdate } from '@/api/types.gen.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

export type ToAccountUpdateBodyInput = {
  accountType: AccountType;
  name: string;
  balance: number;
  openingBalanceDate: string;
};

export const toAccountUpdateBody = ({
  accountType,
  name,
  balance,
  openingBalanceDate,
}: ToAccountUpdateBodyInput): AccountUpdate => {
  const trimmedName = name.trim();

  switch (accountType) {
    case ACCOUNT_TYPE.INCOME:
      return { name: trimmedName };
    case ACCOUNT_TYPE.CURRENT:
      return {
        name: trimmedName,
        opening_balance: String(balance),
        opening_balance_date: openingBalanceDate,
      };
    case ACCOUNT_TYPE.EXPENSE:
      return { name: trimmedName };
    default: {
      const unexpectedAccountType: never = accountType;
      return unexpectedAccountType;
    }
  }
};
