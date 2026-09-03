import { getPrimaryCurrency } from '@/api/sdk.gen.ts';
import { PRIMARY_CURRENCY_MISSING_ERROR } from '@/helpers/currency/constants.ts';
import type { WalletCurrency } from '@/helpers/currency/types.ts';

export const fetchPrimaryCurrency = async (): Promise<WalletCurrency> => {
  try {
    const result = await getPrimaryCurrency();
    const attributes = result.data?.data?.attributes;

    if (!attributes?.code) {
      throw new Error(PRIMARY_CURRENCY_MISSING_ERROR);
    }

    const { code, name, symbol, decimal_places: decimalPlaces = 2 } =
      attributes;

    return { code, name, symbol, decimalPlaces };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(PRIMARY_CURRENCY_MISSING_ERROR);
  }
};
