import {
  FIREFLY_TRANSACTION_TYPE,
  FireflyTransactionType,
} from '@/modules/budget/constants/transactions.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

export type EditableAccountTransaction = AccountTransaction & {
  type: FireflyTransactionType;
  journalId: string;
};

export const isEditableAccountTransaction = (
  transaction: AccountTransaction,
): transaction is EditableAccountTransaction =>
  transaction.journalId !== null &&
  (transaction.type === FIREFLY_TRANSACTION_TYPE.DEPOSIT ||
    transaction.type === FIREFLY_TRANSACTION_TYPE.WITHDRAWAL ||
    transaction.type === FIREFLY_TRANSACTION_TYPE.TRANSFER);
