import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateAccount, updatePreference } from '@/api/sdk.gen.ts';
import {
  ACCOUNT_TYPE,
  CREATE_BUDGET_ACCOUNT_FAILURE_REASON,
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
  FIREFLY_ACCOUNT_TYPE,
} from '@/modules/budget/constants.ts';
import { updateBudgetAccount } from '@/modules/budget/helpers/updateBudgetAccount.ts';
import type { EditAccountFormValues } from '@/modules/budget/types/editAccountForm.ts';
import {
  appearancePreferenceKey,
  createAccountSingleResult,
  createFireflyAccount,
  createMissingAccountResult,
  createPreferenceSingleResult,
  orderPreferenceKey,
  sampleAccountAppearanceJson,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  updateAccount: vi.fn(),
  updatePreference: vi.fn(),
}));

const updateAccountMock = vi.mocked(updateAccount);
const updatePreferenceMock = vi.mocked(updatePreference);

const values: EditAccountFormValues = {
  name: 'Wallet',
  icon: DEFAULT_ACCOUNT_ICON,
  color: DEFAULT_ACCOUNT_COLOR,
  balance: 40,
};

const input = {
  id: '99',
  accountType: ACCOUNT_TYPE.CURRENT,
  values,
  openingBalanceDate: '2026-09-11',
};

describe('updateBudgetAccount', () => {
  beforeEach(() => {
    updateAccountMock.mockReset();
    updatePreferenceMock.mockReset();
  });

  it('updates the account then writes appearance and does not write order', async () => {
    updateAccountMock.mockResolvedValue(
      createAccountSingleResult(
        createFireflyAccount('99', FIREFLY_ACCOUNT_TYPE.ASSET, values.name),
      ),
    );
    updatePreferenceMock.mockResolvedValue(
      createPreferenceSingleResult('ok', ''),
    );

    expect(await updateBudgetAccount(input)).toEqual({ ok: true });

    expect(updateAccountMock).toHaveBeenCalledTimes(1);
    expect(updateAccountMock).toHaveBeenCalledWith({
      path: { id: '99' },
      body: {
        name: values.name,
        opening_balance: '40',
        opening_balance_date: '2026-09-11',
      },
    });
    expect(updatePreferenceMock).toHaveBeenCalledTimes(1);
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: appearancePreferenceKey('99') },
      body: { data: sampleAccountAppearanceJson },
    });
    expect(updatePreferenceMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        path: { name: orderPreferenceKey(ACCOUNT_TYPE.CURRENT) },
      }),
    );
  });

  it('does not write preferences when the update payload is missing', async () => {
    updateAccountMock.mockResolvedValue(
      createMissingAccountResult({ message: 'missing' }),
    );

    expect(await updateBudgetAccount(input)).toEqual({
      ok: false,
      reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED,
    });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('returns a name failure when Firefly rejects the name', async () => {
    updateAccountMock.mockResolvedValue(
      createMissingAccountResult({
        errors: { name: ['The name has already been taken.'] },
      }),
    );

    expect(await updateBudgetAccount(input)).toEqual({
      ok: false,
      reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.NAME,
    });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('still succeeds when appearance fails after a successful update', async () => {
    updateAccountMock.mockResolvedValue(
      createAccountSingleResult(
        createFireflyAccount('99', FIREFLY_ACCOUNT_TYPE.ASSET, values.name),
      ),
    );
    updatePreferenceMock.mockRejectedValue(new Error('prefs down'));

    expect(await updateBudgetAccount(input)).toEqual({ ok: true });
    expect(updatePreferenceMock).toHaveBeenCalledTimes(1);
  });
});
