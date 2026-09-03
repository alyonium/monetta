import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPrimaryCurrency } from '@/api/sdk.gen.ts';
import type { CurrencyProperties } from '@/api/types.gen.ts';
import {
  PRIMARY_CURRENCY_MISSING_ERROR,
  UNAUTHENTICATED_ERROR_MESSAGE,
} from '@/helpers/currency/constants.ts';
import { fetchPrimaryCurrency } from '@/helpers/currency/fetchPrimaryCurrency.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  getPrimaryCurrency: vi.fn(),
}));

const getPrimaryCurrencyMock = vi.mocked(getPrimaryCurrency);

const mockRequest = () =>
  new Request('https://demo.firefly-iii.org/api/v1/currencies/primary');

const primaryCurrencyResult = (attributes: CurrencyProperties) => ({
  data: {
    data: {
      type: 'currencies',
      id: '1',
      attributes,
    },
  },
  error: undefined,
  request: mockRequest(),
  response: new Response(null, { status: 200 }),
});

const expectToThrowPrimaryCurrencyMissing = async () => {
  let caught: Error | undefined;

  try {
    await fetchPrimaryCurrency();
  } catch (error) {
    if (error instanceof Error) {
      caught = error;
    }
  }

  expect(caught).toEqual(new Error(PRIMARY_CURRENCY_MISSING_ERROR));
};

describe('fetchPrimaryCurrency', () => {
  beforeEach(() => {
    getPrimaryCurrencyMock.mockReset();
  });

  it('maps currency attributes to WalletCurrency', async () => {
    getPrimaryCurrencyMock.mockResolvedValue(
      primaryCurrencyResult({
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        decimal_places: 4,
      }),
    );

    const currency = await fetchPrimaryCurrency();

    expect(currency).toEqual({
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      decimalPlaces: 4,
    });
  });

  it('throws when data or code is missing', async () => {
    getPrimaryCurrencyMock.mockResolvedValue({
      data: undefined,
      error: { message: UNAUTHENTICATED_ERROR_MESSAGE },
      request: mockRequest(),
      response: new Response(null, { status: 401 }),
    });

    await expectToThrowPrimaryCurrencyMissing();

    getPrimaryCurrencyMock.mockResolvedValue(
      primaryCurrencyResult({
        code: '',
        name: 'Euro',
        symbol: '€',
      }),
    );

    await expectToThrowPrimaryCurrencyMissing();
  });
});
