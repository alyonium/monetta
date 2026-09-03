import type { ExchangeRate } from '@/helpers/currency/types.ts';

const findRate = (
  rates: readonly ExchangeRate[],
  fromCode: string,
  toCode: string,
): ExchangeRate | undefined =>
  rates.find(
    (rate) =>
      rate.fromCode.toUpperCase() === fromCode &&
      rate.toCode.toUpperCase() === toCode,
  );

export const convertToPrimary = ({
  amount,
  fromCode,
  primaryCurrencyCode,
  rates,
}: {
  amount: number;
  fromCode: string;
  primaryCurrencyCode: string;
  rates: readonly ExchangeRate[];
}): number | null => {
  const from = fromCode.toUpperCase();
  const primary = primaryCurrencyCode.toUpperCase();

  if (from === primary) {
    return amount;
  }

  const direct = findRate(rates, from, primary);

  if (direct) {
    return amount * direct.rate;
  }

  const reverse = findRate(rates, primary, from);

  if (reverse && reverse.rate !== 0) {
    return amount / reverse.rate;
  }

  return null;
};
