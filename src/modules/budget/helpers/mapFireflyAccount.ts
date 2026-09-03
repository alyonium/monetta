import type { AccountProperties, AccountRead } from '@/api/types.gen.ts';
import { ACCOUNT_TYPE, FIREFLY_ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import type {
  AccountAppearance,
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';

const toBudgetAccountType = (
  fireflyType: AccountProperties['type'],
): { type: AccountType; isDebt: boolean } | null => {
  switch (fireflyType) {
    case FIREFLY_ACCOUNT_TYPE.REVENUE:
      return { type: ACCOUNT_TYPE.INCOME, isDebt: false };
    case FIREFLY_ACCOUNT_TYPE.ASSET:
      return { type: ACCOUNT_TYPE.CURRENT, isDebt: false };
    case FIREFLY_ACCOUNT_TYPE.EXPENSE:
      return { type: ACCOUNT_TYPE.EXPENSE, isDebt: false };
    case FIREFLY_ACCOUNT_TYPE.LIABILITY:
    case FIREFLY_ACCOUNT_TYPE.LIABILITIES:
      return { type: ACCOUNT_TYPE.EXPENSE, isDebt: true };
    default:
      return null;
  }
};

const toFiniteNumber = (value: string | null | undefined): number | null => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const debtFields = (
  isDebt: boolean,
  balance: number,
  attributes: AccountProperties,
): Pick<BudgetAccount, 'debtAmount' | 'paidAmount'> => {
  if (!isDebt) {
    return { debtAmount: null, paidAmount: null };
  }

  const debtAmount =
    toFiniteNumber(attributes.debt_amount) ?? Math.abs(balance);
  const openingBalance = toFiniteNumber(attributes.opening_balance);
  const paidAmount =
    openingBalance === null
      ? 0
      : Math.max(0, Math.abs(openingBalance) - debtAmount);

  return { debtAmount, paidAmount };
};

export const mapFireflyAccount = (
  account: Pick<AccountRead, 'id' | 'attributes'>,
  appearance?: AccountAppearance,
): BudgetAccount | null => {
  const id = account.id.trim();
  const { attributes } = account;
  const name = attributes.name.trim();

  if (!id || !name) {
    return null;
  }

  if (attributes.active === false) {
    return null;
  }

  const mappedType = toBudgetAccountType(attributes.type);

  if (!mappedType) {
    return null;
  }

  const { type, isDebt } = mappedType;
  const { icon = null, color = null } = appearance ?? {};
  const {
    current_balance,
    currency_code,
    primary_currency_code,
    currency_symbol,
    primary_currency_symbol,
  } = attributes;

  const balance = toFiniteNumber(current_balance) ?? 0;
  const currencyCode = (
    currency_code?.trim() ||
    primary_currency_code?.trim() ||
    ''
  ).toUpperCase();
  const currencySymbol = currency_symbol || primary_currency_symbol || '';

  return {
    id,
    name,
    type,
    isDebt,
    icon,
    color,
    balance,
    currencyCode,
    currencySymbol,
    ...debtFields(isDebt, balance, attributes),
  };
};
