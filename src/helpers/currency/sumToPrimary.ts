import { convertToPrimary } from '@/helpers/currency/convertToPrimary.ts';
import type {
  AmountInCurrency,
  ExchangeRate,
} from '@/helpers/currency/types.ts';

export const sumToPrimary = (
  items: AmountInCurrency[],
  primaryCurrencyCode: string,
  rates: ExchangeRate[],
): number | null =>
  items.reduce<number | null>((total, item) => {
    if (total === null) {
      return null;
    }

    const converted = convertToPrimary({
      amount: item.amount,
      fromCode: item.fromCode,
      primaryCurrencyCode,
      rates,
    });

    return converted === null ? null : total + converted;
  }, 0);
