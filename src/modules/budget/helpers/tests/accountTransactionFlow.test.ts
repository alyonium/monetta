import { describe, expect, it } from 'vitest';
import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants/transactions.ts';
import { accountTransactionFlow } from '@/modules/budget/helpers/accountTransactionFlow.ts';
import { createAccountTransaction } from './testHelpers.ts';

const transfer = createAccountTransaction({
  sourceId: 'wallet',
  destinationId: 'shop',
  sourceName: 'Wallet',
  destinationName: 'Shop',
});

describe('accountTransactionFlow', () => {
  it('is an inflow when the open account is the destination', () => {
    expect(
      accountTransactionFlow(transfer, { id: 'shop', name: 'Shop' }),
    ).toBe(ACCOUNT_TRANSACTION_FLOW.IN);
  });

  it('is an outflow when the open account is the source', () => {
    expect(
      accountTransactionFlow(transfer, { id: 'wallet', name: 'Wallet' }),
    ).toBe(ACCOUNT_TRANSACTION_FLOW.OUT);
  });

  it('matches by name when ids are empty', () => {
    const unnamed = createAccountTransaction({
      sourceId: '',
      destinationId: '',
      sourceName: 'Wallet',
      destinationName: 'Shop',
    });

    expect(
      accountTransactionFlow(unnamed, { id: '9', name: 'Shop' }),
    ).toBe(ACCOUNT_TRANSACTION_FLOW.IN);
    expect(
      accountTransactionFlow(unnamed, { id: '9', name: 'Wallet' }),
    ).toBe(ACCOUNT_TRANSACTION_FLOW.OUT);
  });

  it('does not guess a direction when the account is not on the transaction', () => {
    expect(
      accountTransactionFlow(transfer, { id: 'other', name: 'Other' }),
    ).toBeNull();
  });
});
