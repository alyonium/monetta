import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteTransaction } from '@/api/sdk.gen.ts';
import { deleteBudgetTransaction } from '@/modules/budget/helpers/transactions/deleteBudgetTransaction.ts';
import {
  createMissingTransactionResult,
  createRequest,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  deleteTransaction: vi.fn(),
}));

const deleteTransactionMock = vi.mocked(deleteTransaction);

const deleted = () => ({
  data: undefined,
  error: undefined,
  request: createRequest('transactions/10'),
  response: new Response(null, { status: 204 }),
});

describe('deleteBudgetTransaction', () => {
  beforeEach(() => {
    deleteTransactionMock.mockReset();
  });

  it('returns ok on 204', async () => {
    deleteTransactionMock.mockResolvedValue(deleted());

    expect(await deleteBudgetTransaction('10')).toEqual({ ok: true });
    expect(deleteTransactionMock).toHaveBeenCalledWith({
      path: { id: '10' },
    });
  });

  it('returns failed when Firefly responds 404', async () => {
    deleteTransactionMock.mockResolvedValue(
      createMissingTransactionResult({}, 404),
    );

    expect(await deleteBudgetTransaction('10')).toEqual({ ok: false });
  });

  it('returns failed when the request throws', async () => {
    deleteTransactionMock.mockRejectedValue(new Error('network'));

    expect(await deleteBudgetTransaction('10')).toEqual({ ok: false });
  });
});
