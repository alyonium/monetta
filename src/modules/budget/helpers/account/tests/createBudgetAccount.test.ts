import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storeAccount, storePreference, updatePreference } from '@/api/sdk.gen.ts';
import {
  ACCOUNT_TYPE,
  CREATE_BUDGET_ACCOUNT_FAILURE_REASON,
  FIREFLY_ACCOUNT_TYPE,
} from '@/modules/budget/constants/account.ts';
import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from '@/modules/budget/constants/appearance.ts';
import { createBudgetAccount } from '@/modules/budget/helpers/account/createBudgetAccount.ts';
import type { CreateAccountFormValues } from '@/modules/budget/types/createAccountForm.ts';
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
  storeAccount: vi.fn(),
  updatePreference: vi.fn(),
  storePreference: vi.fn(),
}));

const storeAccountMock = vi.mocked(storeAccount);
const updatePreferenceMock = vi.mocked(updatePreference);
const storePreferenceMock = vi.mocked(storePreference);

const values: CreateAccountFormValues = {
  name: 'Wallet',
  icon: DEFAULT_ACCOUNT_ICON,
  color: DEFAULT_ACCOUNT_COLOR,
  initialBalance: 0,
  currency: 'EUR',
  isDebt: false,
};

const OPENING_DATE = '2026-09-09';

const input = {
  accountType: ACCOUNT_TYPE.CURRENT,
  values,
  openingBalanceDate: OPENING_DATE,
  orderedIds: ['2', '5'],
};

describe('createBudgetAccount', () => {
  beforeEach(() => {
    storeAccountMock.mockReset();
    updatePreferenceMock.mockReset();
    storePreferenceMock.mockReset();
  });

  it('stores the account then writes appearance and order with the new id last', async () => {
    storeAccountMock.mockResolvedValue(
      createAccountSingleResult(
        createFireflyAccount('99', FIREFLY_ACCOUNT_TYPE.ASSET, values.name),
      ),
    );
    updatePreferenceMock.mockResolvedValue(
      createPreferenceSingleResult('ok', ''),
    );

    expect(await createBudgetAccount(input)).toEqual({ ok: true });

    expect(storeAccountMock).toHaveBeenCalledTimes(1);
    expect(updatePreferenceMock).toHaveBeenCalledTimes(2);
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: appearancePreferenceKey('99') },
      body: { data: sampleAccountAppearanceJson },
    });
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: orderPreferenceKey(ACCOUNT_TYPE.CURRENT) },
      body: { data: ['2', '5', '99'] },
    });
  });

  it('does not write preferences when the store payload is missing', async () => {
    storeAccountMock.mockResolvedValue(
      createMissingAccountResult({ message: 'missing' }),
    );

    expect(await createBudgetAccount(input)).toEqual({
      ok: false,
      reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.FAILED,
    });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('returns a name failure when Firefly rejects the name', async () => {
    storeAccountMock.mockResolvedValue(
      createMissingAccountResult({
        errors: { name: ['The name has already been taken.'] },
      }),
    );

    expect(await createBudgetAccount(input)).toEqual({
      ok: false,
      reason: CREATE_BUDGET_ACCOUNT_FAILURE_REASON.NAME,
    });
    expect(updatePreferenceMock).not.toHaveBeenCalled();
  });

  it('still succeeds when preferences fail after a successful store', async () => {
    storeAccountMock.mockResolvedValue(
      createAccountSingleResult(
        createFireflyAccount('99', FIREFLY_ACCOUNT_TYPE.ASSET, values.name),
      ),
    );
    updatePreferenceMock.mockRejectedValue(new Error('prefs down'));

    expect(await createBudgetAccount(input)).toEqual({ ok: true });
    expect(updatePreferenceMock).toHaveBeenCalledTimes(2);
  });
});
