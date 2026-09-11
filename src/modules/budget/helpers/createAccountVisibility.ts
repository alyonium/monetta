import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

export const createAccountVisibility = (
  type: AccountType,
  isDebt: boolean,
): { showKind: boolean; showMoney: boolean } => {
  switch (type) {
    case ACCOUNT_TYPE.INCOME:
      return { showKind: false, showMoney: false };
    case ACCOUNT_TYPE.CURRENT:
      return { showKind: false, showMoney: true };
    case ACCOUNT_TYPE.EXPENSE:
      return { showKind: true, showMoney: isDebt };
    default: {
      const unexpectedType: never = type;
      return unexpectedType;
    }
  }
};
