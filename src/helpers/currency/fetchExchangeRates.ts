import { listCurrencyExchangeRates } from '@/api/sdk.gen.ts';
import { CurrencyExchangeProperties } from '@/api/types.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  EXCHANGE_RATES_MISSING_ERROR,
  EXCHANGE_RATES_PAGE_LIMIT,
} from '@/helpers/currency/constants.ts';
import { ExchangeRate } from '@/helpers/currency/types.ts';

type ExchangeRateAttributes = Pick<
  CurrencyExchangeProperties,
  'from_currency_code' | 'to_currency_code' | 'rate' | 'date'
>;

const pairKey = (fromCode: string, toCode: string): string =>
  `${fromCode}:${toCode}`;

const mapExchangeRate = (
  attributes: ExchangeRateAttributes | undefined,
): ExchangeRate | null => {
  if (!attributes) {
    return null;
  }

  const {
    from_currency_code,
    to_currency_code,
    date: rawDate,
    rate: rawRate,
  } = attributes;

  const fromCode = from_currency_code?.toUpperCase();
  const toCode = to_currency_code?.toUpperCase();
  const rate = Number(rawRate);

  if (!fromCode || !toCode || !rawDate || !rawRate || !Number.isFinite(rate)) {
    return null;
  }

  return { fromCode, toCode, rate, date: rawDate };
};

const keepLatestByPair = (
  ratesByPair: Map<string, ExchangeRate>,
  rate: ExchangeRate,
): void => {
  const key = pairKey(rate.fromCode, rate.toCode);
  const existing = ratesByPair.get(key);

  if (!existing || rate.date > existing.date) {
    ratesByPair.set(key, rate);
  }
};

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  const items = await collectFireflyPages(
    (page) =>
      listCurrencyExchangeRates({
        query: { page, limit: EXCHANGE_RATES_PAGE_LIMIT },
      }),
    EXCHANGE_RATES_MISSING_ERROR,
  );

  const ratesByPair = new Map<string, ExchangeRate>();

  items.forEach((item) => {
    const mapped = mapExchangeRate(item.attributes);

    if (mapped) {
      keepLatestByPair(ratesByPair, mapped);
    }
  });

  return [...ratesByPair.values()];
};
