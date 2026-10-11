import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  RECORD_DROP_KIND,
  type RecordDropKind,
} from '@/modules/budget/constants/accountDnd.ts';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import type { RecordDrop } from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import type {
  RecordTransactionDrop,
  RecordTransactionKind,
  RecordTransactionKindConfig,
  RecordTransferDrop,
} from '@/modules/budget/types/recordTransactionKind.ts';

export const recordTransactionKindConfig = {
  [RECORD_DROP_KIND.INCOME]: {
    type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
    titleKey: 'budget.recordIncome.title',
    source: {
      labelKey: 'budget.recordIncome.incomeAccount',
      accountType: ACCOUNT_TYPE.INCOME,
    },
    destination: {
      labelKey: 'budget.recordIncome.currentAccount',
      accountType: ACCOUNT_TYPE.CURRENT,
    },
  },
  [RECORD_DROP_KIND.EXPENSE]: {
    type: FIREFLY_TRANSACTION_TYPE.WITHDRAWAL,
    titleKey: 'budget.recordExpense.title',
    source: {
      labelKey: 'budget.recordExpense.currentAccount',
      accountType: ACCOUNT_TYPE.CURRENT,
    },
    destination: {
      labelKey: 'budget.recordExpense.expenseAccount',
      accountType: ACCOUNT_TYPE.EXPENSE,
    },
  },
} as const;

export const isRecordTransactionKind = (
  kind: RecordDropKind,
): kind is RecordTransactionKind =>
  kind === RECORD_DROP_KIND.INCOME || kind === RECORD_DROP_KIND.EXPENSE;

export const toRecordTransactionDrop = (
  drop: RecordDrop | null,
): RecordTransactionDrop | null => {
  if (!drop || !isRecordTransactionKind(drop.kind)) {
    return null;
  }

  return {
    kind: drop.kind,
    source: drop.source,
    destination: drop.destination,
  };
};

export const toRecordTransferDrop = (
  drop: RecordDrop | null,
): RecordTransferDrop | null => {
  if (!drop || drop.kind !== RECORD_DROP_KIND.TRANSFER) {
    return null;
  }

  return {
    source: drop.source,
    destination: drop.destination,
  };
};

export const recordTransactionCurrencyAccount = (
  config: RecordTransactionKindConfig,
  source: BudgetAccount | undefined,
  destination: BudgetAccount | undefined,
): BudgetAccount | undefined => {
  if (config.source.accountType === ACCOUNT_TYPE.CURRENT) {
    return source;
  }

  if (config.destination.accountType === ACCOUNT_TYPE.CURRENT) {
    return destination;
  }

  return undefined;
};
