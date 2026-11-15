import { describe, expect, it } from 'vitest';
import { accountTransactionDate } from '@/modules/budget/helpers/transactions/accountTransactionDate.ts';

describe('accountTransactionDate', () => {
  it('reads the Firefly calendar day from an ISO timestamp', () => {
    expect(accountTransactionDate('2026-03-02T18:30:00+01:00')).toBe(
      '2026-03-02',
    );
  });
});
