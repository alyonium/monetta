import {
  ACCOUNT_APPEARANCE_PREFIX,
  ACCOUNT_ORDER_PREFIX,
} from '@/modules/budget/constants.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

export const appearancePreferenceKey = (accountId: string): string =>
  `${ACCOUNT_APPEARANCE_PREFIX}${accountId}`;

export const orderPreferenceKey = (type: AccountType): string =>
  `${ACCOUNT_ORDER_PREFIX}${type.toLowerCase()}`;
