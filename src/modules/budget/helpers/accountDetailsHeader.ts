import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

export const ACCOUNT_DETAILS_MONEY = {
  NONE: 'none',
  BALANCE: 'balance',
  DEBT: 'debt',
} as const;

export type AccountDetailsMoney =
  (typeof ACCOUNT_DETAILS_MONEY)[keyof typeof ACCOUNT_DETAILS_MONEY];

export type AccountDetailsHeader = {
  showKind: boolean;
  money: AccountDetailsMoney;
};

export const accountDetailsHeader = (
  type: AccountType,
  isDebt: boolean,
): AccountDetailsHeader => {
  switch (type) {
    case ACCOUNT_TYPE.INCOME:
      return { showKind: false, money: ACCOUNT_DETAILS_MONEY.NONE };
    case ACCOUNT_TYPE.CURRENT:
      return { showKind: false, money: ACCOUNT_DETAILS_MONEY.BALANCE };
    case ACCOUNT_TYPE.EXPENSE:
      return {
        showKind: true,
        money: isDebt ? ACCOUNT_DETAILS_MONEY.DEBT : ACCOUNT_DETAILS_MONEY.NONE,
      };
  }
};
