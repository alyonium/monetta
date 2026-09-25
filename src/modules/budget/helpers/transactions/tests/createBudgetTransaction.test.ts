import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storeTransaction } from '@/api/sdk.gen.ts';
import { FIREFLY_TRANSACTION_TYPE } from '@/modules/budget/constants/transactions.ts';
import { createBudgetTransaction } from '@/modules/budget/helpers/transactions/createBudgetTransaction.ts';
import { toTransactionStoreBody } from '@/modules/budget/helpers/transactions/toTransactionStoreBody.ts';
import {
  createFireflyTransaction,
  createMissingTransactionResult,
  createTransactionSingleResult,
  createTransactionSplit,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  storeTransaction: vi.fn(),
}));

const storeTransactionMock = vi.mocked(storeTransaction);

const body = toTransactionStoreBody({
  type: FIREFLY_TRANSACTION_TYPE.DEPOSIT,
  sourceId: 'income-1',
  destinationId: 'current-2',
  amount: 10,
  currencyCode: 'EUR',
  date: '2026-09-13',
  description: '',
  tags: [],
});

describe('createBudgetTransaction', () => {
  beforeEach(() => {
    storeTransactionMock.mockReset();
  });

  it('returns ok when Firefly stores a transaction with an id', async () => {
    storeTransactionMock.mockResolvedValue(
      createTransactionSingleResult(
        createFireflyTransaction('99', [createTransactionSplit()]),
      ),
    );

    expect(await createBudgetTransaction(body)).toEqual({ ok: true });
    expect(storeTransactionMock).toHaveBeenCalledWith({ body });
  });

  it('returns failed when the API responds with an error', async () => {
    storeTransactionMock.mockResolvedValue(
      createMissingTransactionResult({ message: 'missing' }),
    );

    expect(await createBudgetTransaction(body)).toEqual({ ok: false });
  });

  it('returns failed when the response is ok but has no transaction id', async () => {
    storeTransactionMock.mockResolvedValue(
      createTransactionSingleResult(
        createFireflyTransaction('', [createTransactionSplit()]),
      ),
    );

    expect(await createBudgetTransaction(body)).toEqual({ ok: false });
  });

  it('returns failed when the request throws', async () => {
    storeTransactionMock.mockRejectedValue(new Error('network'));

    expect(await createBudgetTransaction(body)).toEqual({ ok: false });
  });
});
