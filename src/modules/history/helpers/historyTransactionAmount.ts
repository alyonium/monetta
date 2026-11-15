import { formatAccountAmount } from '@/modules/budget/helpers/account/formatAccountAmount.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

type HistoryAmountTransaction = Pick<
  AccountTransaction,
  | 'amount'
  | 'currencyCode'
  | 'currencySymbol'
  | 'foreignAmount'
  | 'foreignCurrencyCode'
>;

export type HistoryTransactionAmount =
  | { kind: 'single'; amount: string }
  | { kind: 'pair'; debited: string; credited: string };

export const historyTransactionAmount = (
  transaction: HistoryAmountTransaction,
): HistoryTransactionAmount => {
  if (
    transaction.foreignAmount !== null &&
    transaction.foreignCurrencyCode !== transaction.currencyCode
  ) {
    return {
      kind: 'pair',
      debited: formatAccountAmount(
        transaction.amount,
        transaction.currencySymbol,
        transaction.currencyCode,
      ),
      credited: formatAccountAmount(
        transaction.foreignAmount,
        '',
        transaction.foreignCurrencyCode,
      ),
    };
  }

  return {
    kind: 'single',
    amount: formatAccountAmount(
      transaction.amount,
      transaction.currencySymbol,
      transaction.currencyCode,
    ),
  };
};
