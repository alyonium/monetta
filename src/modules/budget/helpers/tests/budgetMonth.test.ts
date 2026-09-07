import { describe, expect, it } from 'vitest';
import {
  defaultTransactionDate,
  endOfMonth,
  fireflyBalanceDate,
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/budgetMonth.ts';

const TODAY = '2026-09-07';

describe('todayIso', () => {
  it('returns a YYYY-MM-DD date', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('startOfMonth', () => {
  it('returns the first day of the month', () => {
    expect(startOfMonth('2026-09-07')).toBe('2026-09-01');
    expect(startOfMonth('2026-09-01')).toBe('2026-09-01');
  });
});

describe('endOfMonth', () => {
  it('returns the last day of the month', () => {
    expect(endOfMonth('2026-08-01')).toBe('2026-08-31');
    expect(endOfMonth('2026-08-15')).toBe('2026-08-31');
    expect(endOfMonth('2024-02-01')).toBe('2024-02-29');
  });
});

describe('fireflyBalanceDate', () => {
  it('uses today for the current month', () => {
    expect(fireflyBalanceDate({ month: '2026-09-01', today: TODAY })).toBe(
      TODAY,
    );
    expect(fireflyBalanceDate({ month: '2026-09-20', today: TODAY })).toBe(
      TODAY,
    );
  });

  it('uses the last day of a past month', () => {
    expect(fireflyBalanceDate({ month: '2026-08-01', today: TODAY })).toBe(
      '2026-08-31',
    );
    expect(fireflyBalanceDate({ month: '2026-08-15', today: TODAY })).toBe(
      '2026-08-31',
    );
  });

  it('uses the last day of a leap February', () => {
    expect(
      fireflyBalanceDate({ month: '2024-02-01', today: '2024-03-01' }),
    ).toBe('2024-02-29');
  });

  it('uses today for a future month', () => {
    expect(fireflyBalanceDate({ month: '2026-10-01', today: TODAY })).toBe(
      TODAY,
    );
  });
});

describe('defaultTransactionDate', () => {
  it('uses today for the current month', () => {
    expect(defaultTransactionDate({ month: '2026-09-01', today: TODAY })).toBe(
      TODAY,
    );
  });

  it('uses the first day of another month', () => {
    expect(defaultTransactionDate({ month: '2026-08-15', today: TODAY })).toBe(
      '2026-08-01',
    );
    expect(defaultTransactionDate({ month: '2026-10-01', today: TODAY })).toBe(
      '2026-10-01',
    );
  });
});
