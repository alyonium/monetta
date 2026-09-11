import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listPreference } from '@/api/sdk.gen.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  ACCOUNT_PREFERENCES_MISSING_ERROR,
  PREFERENCES_PAGE_LIMIT,
} from '@/modules/budget/constants/queries.ts';
import { UNAUTHENTICATED_ERROR_MESSAGE } from '@/helpers/currency/constants.ts';
import { fetchAccountPreferences } from '@/modules/budget/helpers/account/fetchAccountPreferences.ts';
import {
  appearancePreferenceKey,
  createPreference,
  createPreferencePageResult,
  createRequest,
  orderPreferenceKey,
  sampleAccountAppearance,
  sampleAccountAppearanceJson,
} from './testHelpers.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listPreference: vi.fn(),
}));

const listPreferenceMock = vi.mocked(listPreference);

describe('fetchAccountPreferences', () => {
  beforeEach(() => {
    listPreferenceMock.mockReset();
  });

  it('collects appearance and order from two pages and ignores other keys', async () => {
    listPreferenceMock
      .mockResolvedValueOnce(
        createPreferencePageResult(
          [
            createPreference(
              '1',
              appearancePreferenceKey('12'),
              sampleAccountAppearanceJson,
            ),
            createPreference('2', 'language', 'en_US'),
            createPreference('3', orderPreferenceKey(ACCOUNT_TYPE.INCOME), [
              '1',
              '5',
            ]),
          ],
          { current_page: 1, total_pages: 2 },
        ),
      )
      .mockResolvedValueOnce(
        createPreferencePageResult(
          [
            createPreference('4', orderPreferenceKey(ACCOUNT_TYPE.CURRENT), ['2']),
            createPreference(
              '5',
              appearancePreferenceKey('3'),
              '{"icon":"Bank","color":"#12B886"}',
            ),
            createPreference(
              '6',
              appearancePreferenceKey('9'),
              '{not json',
            ),
            createPreference(
              '7',
              orderPreferenceKey(ACCOUNT_TYPE.EXPENSE),
              'not-an-array',
            ),
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );

    const prefs = await fetchAccountPreferences();

    expect(listPreferenceMock).toHaveBeenCalledTimes(2);
    expect(listPreferenceMock).toHaveBeenNthCalledWith(1, {
      query: { page: 1, limit: PREFERENCES_PAGE_LIMIT },
    });
    expect(listPreferenceMock).toHaveBeenNthCalledWith(2, {
      query: { page: 2, limit: PREFERENCES_PAGE_LIMIT },
    });
    expect(prefs).toEqual({
      appearanceById: {
        '12': sampleAccountAppearance,
        '3': { icon: 'Bank', color: '#12B886' },
      },
      orderByBlock: {
        [ACCOUNT_TYPE.INCOME]: ['1', '5'],
        [ACCOUNT_TYPE.CURRENT]: ['2'],
        [ACCOUNT_TYPE.EXPENSE]: [],
      },
    });
  });

  it('returns empty maps when data is an empty list', () => {
    listPreferenceMock.mockResolvedValue(
      createPreferencePageResult([], { current_page: 1, total_pages: 1 }),
    );

    return expect(fetchAccountPreferences()).resolves.toEqual({
      appearanceById: {},
      orderByBlock: {
        [ACCOUNT_TYPE.INCOME]: [],
        [ACCOUNT_TYPE.CURRENT]: [],
        [ACCOUNT_TYPE.EXPENSE]: [],
      },
    });
  });

  it('throws when data is missing', async () => {
    listPreferenceMock.mockResolvedValue({
      data: undefined,
      error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
      request: createRequest('preferences'),
      response: new Response(null, { status: 401 }),
    });

    let missingDataError: Error | undefined;

    try {
      await fetchAccountPreferences();
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(
      new Error(ACCOUNT_PREFERENCES_MISSING_ERROR),
    );
  });
});
