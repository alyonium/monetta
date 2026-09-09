import type { AccountStore } from '@/api/types.gen.ts';
import {
  ACCOUNT_TYPE,
  FIREFLY_ACCOUNT_ROLE,
  FIREFLY_ACCOUNT_TYPE,
  FIREFLY_LIABILITY_DIRECTION,
  FIREFLY_LIABILITY_INTEREST,
  FIREFLY_LIABILITY_INTEREST_PERIOD,
  FIREFLY_LIABILITY_TYPE,
} from '@/modules/budget/constants.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';
import type { CreateAccountFormValues } from '@/modules/budget/types/createAccountForm.ts';

export type ToAccountStoreBodyInput = Pick<
  CreateAccountFormValues,
  'name' | 'isDebt' | 'currency' | 'initialBalance'
> & {
  accountType: AccountType;
  openingBalanceDate: string;
};

const moneyFields = (
  currency: string,
  initialBalance: number,
  openingBalanceDate: string,
): Pick<
  AccountStore,
  'currency_code' | 'opening_balance' | 'opening_balance_date'
> => ({
  currency_code: currency,
  opening_balance: String(initialBalance),
  opening_balance_date: openingBalanceDate,
});

export const toAccountStoreBody = ({
  accountType,
  name,
  isDebt,
  currency,
  initialBalance,
  openingBalanceDate,
}: ToAccountStoreBodyInput): AccountStore => {
  const trimmedName = name.trim();

  switch (accountType) {
    case ACCOUNT_TYPE.INCOME:
      return { name: trimmedName, type: FIREFLY_ACCOUNT_TYPE.REVENUE };
    case ACCOUNT_TYPE.CURRENT:
      return {
        name: trimmedName,
        type: FIREFLY_ACCOUNT_TYPE.ASSET,
        account_role: FIREFLY_ACCOUNT_ROLE.DEFAULT_ASSET,
        ...moneyFields(currency, initialBalance, openingBalanceDate),
      };
    case ACCOUNT_TYPE.EXPENSE:
      if (isDebt) {
        return {
          name: trimmedName,
          type: FIREFLY_ACCOUNT_TYPE.LIABILITY,
          liability_type: FIREFLY_LIABILITY_TYPE.DEBT,
          liability_direction: FIREFLY_LIABILITY_DIRECTION.DEBIT,
          interest: FIREFLY_LIABILITY_INTEREST,
          interest_period: FIREFLY_LIABILITY_INTEREST_PERIOD.MONTHLY,
          ...moneyFields(currency, initialBalance, openingBalanceDate),
        };
      }

      return { name: trimmedName, type: FIREFLY_ACCOUNT_TYPE.EXPENSE };
  }
};
