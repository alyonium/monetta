import { describe, expect, it } from 'vitest';
import { groupAccountTransactions } from '@/modules/budget/helpers/transactions/groupAccountTransactions.ts';
import { createAccountTransaction } from './testHelpers.ts';

describe('groupAccountTransactions', () => {
  it('groups by calendar date descending and sorts items by dateTime', () => {
    const olderMorning = createAccountTransaction({
      journalId: '1',
      date: '2026-01-10',
      dateTime: '2026-01-10T08:00:00+00:00',
    });
    const newerEvening = createAccountTransaction({
      journalId: '2',
      date: '2026-01-15',
      dateTime: '2026-01-15T20:00:00+00:00',
    });
    const newerNoon = createAccountTransaction({
      journalId: '3',
      date: '2026-01-15',
      dateTime: '2026-01-15T12:00:00+00:00',
    });

    const groups = groupAccountTransactions([
      olderMorning,
      newerNoon,
      newerEvening,
    ]);

    expect(groups.map((group) => group.date)).toEqual([
      '2026-01-15',
      '2026-01-10',
    ]);
    expect(groups[0]?.label).toBe('15 Jan 2026');
    expect(groups[1]?.label).toBe('10 Jan 2026');
    expect(groups[0]?.items.map((item) => item.journalId)).toEqual(['2', '3']);
    expect(groups[1]?.items.map((item) => item.journalId)).toEqual(['1']);
  });
});
