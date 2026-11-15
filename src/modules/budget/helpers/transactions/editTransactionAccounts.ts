import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  FIREFLY_TRANSACTION_TYPE,
  FireflyTransactionType,
} from '@/modules/budget/constants/transactions.ts';
import { transferCurrenciesDiffer } from '@/modules/budget/helpers/transactions/transferCurrenciesDiffer.ts';
import {
  AccountType,
  BudgetAccount,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

const editTransactionKind = {
  [FIREFLY_TRANSACTION_TYPE.DEPOSIT]: {
    source: ACCOUNT_TYPE.INCOME,
    destination: ACCOUNT_TYPE.CURRENT,
    currency: 'destination',
    foreign: false,
  },
  [FIREFLY_TRANSACTION_TYPE.WITHDRAWAL]: {
    source: ACCOUNT_TYPE.CURRENT,
    destination: ACCOUNT_TYPE.EXPENSE,
    currency: 'source',
    foreign: false,
  },
  [FIREFLY_TRANSACTION_TYPE.TRANSFER]: {
    source: ACCOUNT_TYPE.CURRENT,
    destination: ACCOUNT_TYPE.CURRENT,
    currency: 'source',
    foreign: true,
  },
} as const satisfies Record<
  FireflyTransactionType,
  {
    source: AccountType;
    destination: AccountType;
    currency: 'source' | 'destination';
    foreign: boolean;
  }
>;

export const editTransactionAccounts = (
  type: FireflyTransactionType,
  accounts: BudgetAccountsByBlock,
): {
  sourceAccounts: BudgetAccount[];
  destinationAccounts: BudgetAccount[];
} => {
  const kind = editTransactionKind[type];

  return {
    sourceAccounts: accounts[kind.source],
    destinationAccounts: accounts[kind.destination],
  };
};

export const editTransactionCurrencies = (
  type: FireflyTransactionType,
  source: BudgetAccount | undefined,
  destination: BudgetAccount | undefined,
): {
  currencyCode: string;
  foreignCurrencyCode: string;
  currenciesDiffer: boolean;
} => {
  const kind = editTransactionKind[type];
  const currencyAccount = kind.currency === 'source' ? source : destination;
  const currenciesDiffer =
    kind.foreign && transferCurrenciesDiffer(source, destination);

  return {
    currencyCode: currencyAccount?.currencyCode ?? '',
    foreignCurrencyCode: currenciesDiffer
      ? (destination?.currencyCode ?? '')
      : '',
    currenciesDiffer,
  };
};
