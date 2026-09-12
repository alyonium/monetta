import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteAccount, updatePreference } from '@/api/sdk.gen.ts';
import { deleteBudgetAccount } from '@/modules/budget/helpers/account/deleteBudgetAccount.ts';
import {
  createDeletedAccountResult,
  createMissingAccountResult,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  deleteAccount: vi.fn(),
  updatePreference: vi.fn(),
}));

const deleteAccountMock = vi.mocked(deleteAccount);
const updatePreferenceMock = vi.mocked(updatePreference);

describe('deleteBudgetAccount', () => {
  beforeEach(() => {
    deleteAccountMock.mockReset();
    updatePreferenceMock.mockReset();
  });

  it('returns ok on 204 and does not write preferences', async () => {
    deleteAccountMock.mockResolvedValue(createDeletedAccountResult());

    expect(await deleteBudgetAccount('99')).toEqual({ ok: true });

    expect(deleteAccountMock).toHaveBeenCalledTimes(1);
    expect(deleteAccountMock).toHaveBeenCalledWith({ path: { id: '99' } });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('returns failed when Firefly responds 404', async () => {
    deleteAccountMock.mockResolvedValue(
      createMissingAccountResult({ message: 'not found' }, 404),
    );

    expect(await deleteBudgetAccount('99')).toEqual({ ok: false });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('returns failed when the request throws', async () => {
    deleteAccountMock.mockRejectedValue(new Error('network'));

    expect(await deleteBudgetAccount('99')).toEqual({ ok: false });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });
});
