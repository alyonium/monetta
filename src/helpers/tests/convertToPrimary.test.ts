import { describe, expect, it } from 'vitest';
import { convertToPrimary } from '@/helpers/currency/convertToPrimary.ts';
import type { ExchangeRate } from '@/helpers/currency/types.ts';

const rate = (
  fromCode: string,
  toCode: string,
  value: number,
): ExchangeRate => ({
  fromCode,
  toCode,
  rate: value,
  date: '2026-01-01T00:00:00+00:00',
});

describe('convertToPrimary', () => {
  it('returns the amount when the currency is already primary', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'EUR',
        rates: [],
      }),
    ).toBe(10);
    expect(
      convertToPrimary({
        amount: 0,
        fromCode: 'EUR',
        primaryCurrencyCode: 'EUR',
        rates: [],
      }),
    ).toBe(0);
  });

  it('multiplies by a direct from-to rate', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'USD',
        rates: [rate('EUR', 'USD', 1.1)],
      }),
    ).toBe(11);
  });

  it('divides by a reverse primary-from rate', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'USD',
        rates: [rate('USD', 'EUR', 0.5)],
      }),
    ).toBe(20);
  });

  it('returns null when no matching pair exists', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'USD',
        rates: [rate('GBP', 'JPY', 190)],
      }),
    ).toBeNull();
  });

  it('matches currency codes case-insensitively', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'eur',
        primaryCurrencyCode: 'usd',
        rates: [rate('EUR', 'USD', 1.1)],
      }),
    ).toBe(11);
  });
});
