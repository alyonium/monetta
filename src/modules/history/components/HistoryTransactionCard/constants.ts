import { TransactionTypeProperty } from '@/api/types.gen.ts';

export const HISTORY_TRANSACTION_TYPE_KEY = {
  deposit: 'history.type.deposit',
  withdrawal: 'history.type.withdrawal',
  transfer: 'history.type.transfer',
  reconciliation: 'history.type.reconciliation',
  'opening balance': 'history.type.openingBalance',
} as const satisfies Record<TransactionTypeProperty, string>;
