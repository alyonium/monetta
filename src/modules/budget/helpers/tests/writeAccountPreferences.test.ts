import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storePreference, updatePreference } from '@/api/sdk.gen.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { ACCOUNT_PREFERENCE_WRITE_ERROR } from '@/modules/budget/constants/queries.ts';
import {
  writeAccountAppearance,
  writeAccountOrder,
} from '@/modules/budget/helpers/writeAccountPreferences.ts';
import {
  appearancePreferenceKey,
  createMissingPreferenceResult,
  createPreferenceSingleResult,
  orderPreferenceKey,
  sampleAccountAppearance,
  sampleAccountAppearanceJson,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  updatePreference: vi.fn(),
  storePreference: vi.fn(),
}));

const updatePreferenceMock = vi.mocked(updatePreference);
const storePreferenceMock = vi.mocked(storePreference);

describe('writeAccountPreferences', () => {
  beforeEach(() => {
    updatePreferenceMock.mockReset();
    storePreferenceMock.mockReset();
  });

  it('PUTs appearance as a JSON string and returns the written value', async () => {
    updatePreferenceMock.mockResolvedValue(
      createPreferenceSingleResult(
        appearancePreferenceKey('12'),
        sampleAccountAppearanceJson,
      ),
    );

    const result = await writeAccountAppearance('12', sampleAccountAppearance);

    expect(result).toEqual(sampleAccountAppearance);
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: appearancePreferenceKey('12') },
      body: { data: sampleAccountAppearanceJson },
    });
  });

  it('PUTs order as an array of ids and returns the written value', async () => {
    const ids = ['1', '5', '3'];
    updatePreferenceMock.mockResolvedValue(
      createPreferenceSingleResult(orderPreferenceKey(ACCOUNT_TYPE.EXPENSE), ids),
    );

    const result = await writeAccountOrder(ACCOUNT_TYPE.EXPENSE, ids);

    expect(result).toEqual(ids);
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: orderPreferenceKey(ACCOUNT_TYPE.EXPENSE) },
      body: { data: ids },
    });
    expect(storePreferenceMock).not.toHaveBeenCalled();
  });

  it('POSTs a new preference when PUT returns 404', async () => {
    updatePreferenceMock.mockResolvedValue(createMissingPreferenceResult(404));
    storePreferenceMock.mockResolvedValue(
      createPreferenceSingleResult(
        appearancePreferenceKey('12'),
        sampleAccountAppearanceJson,
      ),
    );

    const result = await writeAccountAppearance('12', sampleAccountAppearance);

    expect(result).toEqual(sampleAccountAppearance);
    expect(storePreferenceMock).toHaveBeenCalledWith({
      body: {
        name: appearancePreferenceKey('12'),
        data: sampleAccountAppearanceJson,
      },
    });
  });

  it('throws when the SDK throws or the payload is missing', async () => {
    updatePreferenceMock.mockRejectedValue(new Error('network'));

    let networkError: Error | undefined;

    try {
      await writeAccountAppearance('12', sampleAccountAppearance);
    } catch (error) {
      if (error instanceof Error) {
        networkError = error;
      }
    }

    expect(networkError).toEqual(new Error('network'));

    updatePreferenceMock.mockResolvedValue(createMissingPreferenceResult());

    let missingDataError: Error | undefined;

    try {
      await writeAccountOrder(ACCOUNT_TYPE.INCOME, ['1']);
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(ACCOUNT_PREFERENCE_WRITE_ERROR));
    expect(storePreferenceMock).not.toHaveBeenCalled();
  });
});
