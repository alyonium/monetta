import type { ExchangeRate } from '@/helpers/currency/types.ts';

export const createExchangeRate = (
  fromCode: string,
  toCode: string,
  value: number,
): ExchangeRate => ({
  fromCode,
  toCode,
  rate: value,
  date: '2026-01-01T00:00:00+00:00',
});
