import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updatePreference } from '@/api/sdk.gen.ts';
import {
  ACCOUNT_PREFERENCE_WRITE_ERROR,
  ACCOUNT_TYPE,
} from '@/modules/budget/constants.ts';
import { UNAUTHENTICATED_ERROR_MESSAGE } from '@/helpers/currency/constants.ts';
import {
  writeAccountAppearance,
  writeAccountOrder,
} from '@/modules/budget/helpers/writeAccountPreferences.ts';
import {
  sampleAccountAppearance,
  sampleAccountAppearanceJson,
} from '@/modules/budget/tests/accountAppearanceFixture.ts';
import {
  appearancePreferenceKey,
  orderPreferenceKey,
} from '@/modules/budget/tests/preferenceKeyFixture.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  updatePreference: vi.fn(),
}));

const updatePreferenceMock = vi.mocked(updatePreference);

const mockRequest = () =>
  new Request('https://demo.firefly-iii.org/api/v1/preferences/name');

const mockSuccessResult = (name: string, data: string | string[]) => ({
  data: {
    data: {
      type: 'preferences',
      id: '1',
      attributes: { name, data },
    },
  },
  error: undefined,
  request: mockRequest(),
  response: new Response(null, { status: 200 }),
});

const mockMissingPayload = () => ({
  data: undefined,
  error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
  request: mockRequest(),
  response: new Response(null, { status: 401 }),
});

describe('writeAccountPreferences', () => {
  beforeEach(() => {
    updatePreferenceMock.mockReset();
  });

  it('PUTs appearance as a JSON string and returns the written value', async () => {
    updatePreferenceMock.mockResolvedValue(
      mockSuccessResult(
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
      mockSuccessResult(orderPreferenceKey(ACCOUNT_TYPE.EXPENSE), ids),
    );

    const result = await writeAccountOrder(ACCOUNT_TYPE.EXPENSE, ids);

    expect(result).toEqual(ids);
    expect(updatePreferenceMock).toHaveBeenCalledWith({
      path: { name: orderPreferenceKey(ACCOUNT_TYPE.EXPENSE) },
      body: { data: ids },
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

    updatePreferenceMock.mockResolvedValue(mockMissingPayload());

    let missingDataError: Error | undefined;

    try {
      await writeAccountOrder(ACCOUNT_TYPE.INCOME, ['1']);
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(ACCOUNT_PREFERENCE_WRITE_ERROR));
  });
});
