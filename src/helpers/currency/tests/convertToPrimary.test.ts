import { describe, expect, it } from 'vitest';
import { convertToPrimary } from '@/helpers/currency/convertToPrimary.ts';
import { createExchangeRate } from '@/helpers/currency/tests/testHelpers.ts';

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
        rates: [createExchangeRate('EUR', 'USD', 1.1)],
      }),
    ).toBe(11);
  });

  it('divides by a reverse primary-from rate', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'USD',
        rates: [createExchangeRate('USD', 'EUR', 0.5)],
      }),
    ).toBe(20);
  });

  it('returns null when a currency code is missing', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: undefined as unknown as string,
        primaryCurrencyCode: 'EUR',
        rates: [],
      }),
    ).toBeNull();
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'USD',
        primaryCurrencyCode: undefined as unknown as string,
        rates: [],
      }),
    ).toBeNull();
  });

  it('returns null when no matching pair exists', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'EUR',
        primaryCurrencyCode: 'USD',
        rates: [createExchangeRate('GBP', 'JPY', 190)],
      }),
    ).toBeNull();
  });

  it('matches currency codes case-insensitively', () => {
    expect(
      convertToPrimary({
        amount: 10,
        fromCode: 'eur',
        primaryCurrencyCode: 'usd',
        rates: [createExchangeRate('EUR', 'USD', 1.1)],
      }),
    ).toBe(11);
  });
});

