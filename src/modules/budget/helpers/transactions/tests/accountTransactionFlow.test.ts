import { describe, expect, it } from 'vitest';
import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants/transactions.ts';
import { accountTransactionFlow } from '@/modules/budget/helpers/transactions/accountTransactionFlow.ts';
import { createAccountTransaction } from './testHelpers.ts';

const transfer = createAccountTransaction({
  sourceId: 'wallet',
  destinationId: 'shop',
  sourceName: 'Wallet',
  destinationName: 'Shop',
});

describe('accountTransactionFlow', () => {
  it('is an inflow when the open account is the destination', () => {
    expect(accountTransactionFlow(transfer, { id: 'shop' })).toBe(
      ACCOUNT_TRANSACTION_FLOW.IN,
    );
  });

  it('is an outflow when the open account is the source', () => {
    expect(accountTransactionFlow(transfer, { id: 'wallet' })).toBe(
      ACCOUNT_TRANSACTION_FLOW.OUT,
    );
  });

  it('does not guess a direction when the account is not on the transaction', () => {
    expect(accountTransactionFlow(transfer, { id: 'other' })).toBeNull();
  });
});
