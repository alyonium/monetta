import { describe, expect, it } from 'vitest';
import { accountTransactionDate } from '@/modules/budget/helpers/accountTransactionDate.ts';

describe('accountTransactionDate', () => {
  it('reads the Firefly calendar day from an ISO timestamp', () => {
    expect(accountTransactionDate('2026-03-02T18:30:00+01:00')).toBe(
      '2026-03-02',
    );
    expect(accountTransactionDate(' 2026-04-01T09:00:00Z ')).toBe(
      '2026-04-01',
    );
    expect(accountTransactionDate('2026-01-15')).toBe('2026-01-15');
  });

  it('returns null when the value has no calendar day', () => {
    expect(accountTransactionDate('')).toBeNull();
    expect(accountTransactionDate('not-a-date')).toBeNull();
  });
});
