import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listCurrency } from '@/api/sdk.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import { CurrencyRead } from '@/api/types.gen.ts';
import {
  CURRENCIES_MISSING_ERROR,
  CURRENCIES_PAGE_LIMIT,
  UNAUTHENTICATED_ERROR_MESSAGE,
} from '@/helpers/currency/constants.ts';
import { fetchCurrencies } from '@/helpers/currency/fetchCurrencies.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listCurrency: vi.fn(),
}));

const listCurrencyMock = vi.mocked(listCurrency);

const createFireflyCurrency = (
  id: string,
  attributes: CurrencyRead['attributes'],
): CurrencyRead => ({
  type: 'currencies',
  id,
  attributes,
});

const createCurrencyPageResult = (
  data: CurrencyRead[],
  pagination: { current_page: number; total_pages: number },
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: createFireflyRequest('currencies'),
  response: new Response(null, { status: 200 }),
});

describe('fetchCurrencies', () => {
  beforeEach(() => {
    listCurrencyMock.mockReset();
  });

  it('maps currencies and requests the catalog page limit', async () => {
    listCurrencyMock.mockResolvedValue(
      createCurrencyPageResult(
        [
          createFireflyCurrency('1', {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            decimal_places: 2,
          }),
          createFireflyCurrency('2', {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
          }),
          createFireflyCurrency('3', {
            code: 'JPY',
            name: 'Yen',
            symbol: '¥',
            decimal_places: 0,
          }),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const currencies = await fetchCurrencies();

    expect(listCurrencyMock).toHaveBeenCalledWith({
      query: { page: 1, limit: CURRENCIES_PAGE_LIMIT },
    });
    expect(currencies).toEqual([
      { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
      { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
      { code: 'JPY', name: 'Yen', symbol: '¥', decimalPlaces: 0 },
    ]);
  });

  it('keeps disabled currencies', async () => {
    listCurrencyMock.mockResolvedValue(
      createCurrencyPageResult(
        [
          createFireflyCurrency('1', {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            enabled: true,
          }),
          createFireflyCurrency('2', {
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            enabled: false,
          }),
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const currencies = await fetchCurrencies();

    expect(currencies).toEqual([
      { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
      { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
    ]);
  });

  it('throws when data is missing', async () => {
    listCurrencyMock.mockResolvedValue({
      data: undefined,
      error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
      request: createFireflyRequest('currencies'),
      response: new Response(null, { status: 401 }),
    });

    let missingDataError: Error | undefined;

    try {
      await fetchCurrencies();
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(CURRENCIES_MISSING_ERROR));
  });
});
