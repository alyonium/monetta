import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';

export const ACCOUNT_DND = {
  INCOME: { draggable: true, droppable: false },
  CURRENT: { draggable: false, droppable: true },
  EXPENSE: { draggable: false, droppable: false },
} as const satisfies Record<
  (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE],
  { draggable: boolean; droppable: boolean }
>;

export const RECORD_DROP_KIND = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
} as const;

export type RecordDropKind =
  (typeof RECORD_DROP_KIND)[keyof typeof RECORD_DROP_KIND];
