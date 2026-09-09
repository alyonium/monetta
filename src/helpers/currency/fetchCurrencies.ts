import { listCurrency } from '@/api/sdk.gen.ts';
import type { CurrencyRead } from '@/api/types.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  CURRENCIES_MISSING_ERROR,
  CURRENCIES_PAGE_LIMIT,
} from '@/helpers/currency/constants.ts';
import type { WalletCurrency } from '@/helpers/currency/types.ts';

const mapCurrency = (item: CurrencyRead): WalletCurrency | null => {
  const attributes = item.attributes;

  if (!attributes?.code) {
    return null;
  }

  const { code, name, symbol, decimal_places: decimalPlaces = 2 } = attributes;

  return { code, name, symbol, decimalPlaces };
};

export const fetchCurrencies = async (): Promise<WalletCurrency[]> => {
  const items = await collectFireflyPages(
    (page) =>
      listCurrency({
        query: { page, limit: CURRENCIES_PAGE_LIMIT },
      }),
    CURRENCIES_MISSING_ERROR,
  );

  return items.reduce<WalletCurrency[]>((currencies, item) => {
    const mapped = mapCurrency(item);

    if (mapped) {
      currencies.push(mapped);
    }

    return currencies;
  }, []);
};
