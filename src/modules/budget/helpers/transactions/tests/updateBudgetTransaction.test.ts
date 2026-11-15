import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateTransaction } from '@/api/sdk.gen.ts';
import { updateBudgetTransaction } from '@/modules/budget/helpers/transactions/updateBudgetTransaction.ts';
import {
  createFireflyTransaction,
  createMissingTransactionResult,
  createTransactionSingleResult,
  createTransactionSplit,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  updateTransaction: vi.fn(),
}));

const updateTransactionMock = vi.mocked(updateTransaction);

const body = { transactions: [] };

describe('updateBudgetTransaction', () => {
  beforeEach(() => {
    updateTransactionMock.mockReset();
  });

  it('returns ok when Firefly accepts the update', async () => {
    updateTransactionMock.mockResolvedValue(
      createTransactionSingleResult(
        createFireflyTransaction('10', [createTransactionSplit()]),
      ),
    );

    expect(await updateBudgetTransaction('10', body)).toEqual({ ok: true });
    expect(updateTransactionMock).toHaveBeenCalledWith({
      path: { id: '10' },
      body,
    });
  });

  it('returns failed when Firefly responds with an error', async () => {
    updateTransactionMock.mockResolvedValue(createMissingTransactionResult());

    expect(await updateBudgetTransaction('10', body)).toEqual({ ok: false });
  });

  it('returns failed when the request throws', async () => {
    updateTransactionMock.mockRejectedValue(new Error('network'));

    expect(await updateBudgetTransaction('10', body)).toEqual({ ok: false });
  });
});
