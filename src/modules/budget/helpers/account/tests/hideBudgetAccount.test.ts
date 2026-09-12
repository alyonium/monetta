import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateAccount } from '@/api/sdk.gen.ts';
import { hideBudgetAccount } from '@/modules/budget/helpers/account/hideBudgetAccount.ts';
import {
  createAccountSingleResult,
  createFireflyAccount,
  createMissingAccountResult,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  updateAccount: vi.fn(),
}));

const updateAccountMock = vi.mocked(updateAccount);

describe('hideBudgetAccount', () => {
  beforeEach(() => {
    updateAccountMock.mockReset();
  });

  it('PUTs name and active false and returns ok on 200', async () => {
    updateAccountMock.mockResolvedValue(
      createAccountSingleResult(createFireflyAccount('99', 'asset')),
    );

    expect(await hideBudgetAccount('99', 'Cash')).toEqual({ ok: true });
    expect(updateAccountMock).toHaveBeenCalledWith({
      path: { id: '99' },
      body: { name: 'Cash', active: false },
    });
  });

  it('returns failed when Firefly responds 404', async () => {
    updateAccountMock.mockResolvedValue(
      createMissingAccountResult({ message: 'not found' }, 404),
    );

    expect(await hideBudgetAccount('99', 'Cash')).toEqual({ ok: false });
  });

  it('returns failed when the request throws', async () => {
    updateAccountMock.mockRejectedValue(new Error('network'));

    expect(await hideBudgetAccount('99', 'Cash')).toEqual({ ok: false });
  });
});
