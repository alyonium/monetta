import { describe, expect, it } from 'vitest';
import { sumToPrimary } from '@/helpers/currency/sumToPrimary.ts';
import { createExchangeRate } from '@/helpers/tests/helpers.ts';

describe('sumToPrimary', () => {
  it('returns zero for an empty list', () => {
    expect(sumToPrimary([], 'EUR', [])).toBe(0);
  });

  it('keeps amounts already in the primary currency', () => {
    expect(sumToPrimary([{ amount: 10.5, fromCode: 'EUR' }], 'EUR', [])).toBe(
      10.5,
    );
  });

  it('sums converted foreign amounts with primary-currency ones', () => {
    expect(
      sumToPrimary(
        [
          { amount: 10, fromCode: 'EUR' },
          { amount: 10, fromCode: 'USD' },
        ],
        'EUR',
        [createExchangeRate('USD', 'EUR', 0.5)],
      ),
    ).toBe(15);
  });

  it('keeps signed amounts so overdrafts reduce the total', () => {
    expect(
      sumToPrimary(
        [
          { amount: 100, fromCode: 'EUR' },
          { amount: -20, fromCode: 'EUR' },
        ],
        'EUR',
        [],
      ),
    ).toBe(80);
  });

  it('returns null when a row has no exchange rate', () => {
    expect(
      sumToPrimary([{ amount: 10, fromCode: 'USD' }], 'EUR', []),
    ).toBeNull();
  });
});
