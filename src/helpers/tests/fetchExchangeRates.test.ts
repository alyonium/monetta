import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listCurrencyExchangeRates } from '@/api/sdk.gen.ts';
import type { CurrencyExchangeRateRead } from '@/api/types.gen.ts';
import {
  EXCHANGE_RATES_MISSING_ERROR,
  EXCHANGE_RATES_PAGE_LIMIT,
  UNAUTHENTICATED_ERROR_MESSAGE,
} from '@/helpers/currency/constants.ts';
import { fetchExchangeRates } from '@/helpers/currency/fetchExchangeRates.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  listCurrencyExchangeRates: vi.fn(),
}));

const listCurrencyExchangeRatesMock = vi.mocked(listCurrencyExchangeRates);

const mockRequest = () =>
  new Request('https://demo.firefly-iii.org/api/v1/exchange-rates');

const pageResult = (
  data: CurrencyExchangeRateRead[],
  pagination: { current_page: number; total_pages: number },
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: mockRequest(),
  response: new Response(null, { status: 200 }),
});

describe('fetchExchangeRates', () => {
  beforeEach(() => {
    listCurrencyExchangeRatesMock.mockReset();
  });

  it('collects rates from two pages', async () => {
    listCurrencyExchangeRatesMock
      .mockResolvedValueOnce(
        pageResult(
          [
            {
              attributes: {
                from_currency_code: 'eur',
                to_currency_code: 'USD',
                rate: '1.1',
                date: '2026-01-01T00:00:00+00:00',
              },
            },
            {
              attributes: {
                from_currency_code: 'GBP',
                rate: '1.2',
                date: '2026-01-01T00:00:00+00:00',
              },
            },
          ],
          { current_page: 1, total_pages: 2 },
        ),
      )
      .mockResolvedValueOnce(
        pageResult(
          [
            {
              attributes: {
                from_currency_code: 'USD',
                to_currency_code: 'JPY',
                rate: '150',
                date: '2026-02-01T00:00:00+00:00',
              },
            },
          ],
          { current_page: 2, total_pages: 2 },
        ),
      );

    const rates = await fetchExchangeRates();

    expect(listCurrencyExchangeRatesMock).toHaveBeenCalledTimes(2);
    expect(listCurrencyExchangeRatesMock).toHaveBeenNthCalledWith(1, {
      query: { page: 1, limit: EXCHANGE_RATES_PAGE_LIMIT },
    });
    expect(listCurrencyExchangeRatesMock).toHaveBeenNthCalledWith(2, {
      query: { page: 2, limit: EXCHANGE_RATES_PAGE_LIMIT },
    });
    expect(rates).toEqual([
      {
        fromCode: 'EUR',
        toCode: 'USD',
        rate: 1.1,
        date: '2026-01-01T00:00:00+00:00',
      },
      {
        fromCode: 'USD',
        toCode: 'JPY',
        rate: 150,
        date: '2026-02-01T00:00:00+00:00',
      },
    ]);
  });

  it('keeps the newest date for a from-to pair', async () => {
    listCurrencyExchangeRatesMock.mockResolvedValue(
      pageResult(
        [
          {
            attributes: {
              from_currency_code: 'EUR',
              to_currency_code: 'USD',
              rate: '1.05',
              date: '2026-01-01T00:00:00+00:00',
            },
          },
          {
            attributes: {
              from_currency_code: 'EUR',
              to_currency_code: 'USD',
              rate: '1.2',
              date: '2026-06-01T00:00:00+00:00',
            },
          },
        ],
        { current_page: 1, total_pages: 1 },
      ),
    );

    const rates = await fetchExchangeRates();

    expect(rates).toEqual([
      {
        fromCode: 'EUR',
        toCode: 'USD',
        rate: 1.2,
        date: '2026-06-01T00:00:00+00:00',
      },
    ]);
  });

  it('returns an empty list when data is empty', async () => {
    listCurrencyExchangeRatesMock.mockResolvedValue(
      pageResult([], { current_page: 1, total_pages: 1 }),
    );

    const rates = await fetchExchangeRates();

    expect(rates).toEqual([]);
  });

  it('throws when data is missing', async () => {
    listCurrencyExchangeRatesMock.mockResolvedValue({
      data: undefined,
      error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
      request: mockRequest(),
      response: new Response(null, { status: 401 }),
    });

    let missingDataError: Error | undefined;

    try {
      await fetchExchangeRates();
    } catch (error) {
      if (error instanceof Error) {
        missingDataError = error;
      }
    }

    expect(missingDataError).toEqual(new Error(EXCHANGE_RATES_MISSING_ERROR));
  });
});
