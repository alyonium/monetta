import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { RECORD_DROP_KIND } from '@/modules/budget/constants/accountDnd.ts';
import type { RecordDropKind } from '@/modules/budget/constants/accountDnd.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

export type RecordDrop = {
  kind: RecordDropKind;
  source: BudgetAccount;
  destination: BudgetAccount;
};

export const budgetAccountFromDndData = (
  data: { account?: BudgetAccount } | undefined,
): BudgetAccount | undefined => data?.account;

export const resolveRecordDrop = (
  active: BudgetAccount | undefined | null,
  over: BudgetAccount | undefined | null,
): RecordDrop | null => {
  if (!active || !over || active.id === over.id) {
    return null;
  }

  if (
    active.type === ACCOUNT_TYPE.INCOME &&
    over.type === ACCOUNT_TYPE.CURRENT
  ) {
    return {
      kind: RECORD_DROP_KIND.INCOME,
      source: active,
      destination: over,
    };
  }

  if (
    active.type === ACCOUNT_TYPE.CURRENT &&
    over.type === ACCOUNT_TYPE.EXPENSE
  ) {
    return {
      kind: RECORD_DROP_KIND.EXPENSE,
      source: active,
      destination: over,
    };
  }

  if (
    active.type === ACCOUNT_TYPE.CURRENT &&
    over.type === ACCOUNT_TYPE.CURRENT
  ) {
    return {
      kind: RECORD_DROP_KIND.TRANSFER,
      source: active,
      destination: over,
    };
  }

  return null;
};
