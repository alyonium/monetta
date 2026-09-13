import { describe, expect, it } from 'vitest';
import { commitTag } from '@/helpers/tags/commitTag.ts';

const catalog = ['Groceries', 'Salary'];

describe('commitTag', () => {
  it('returns the same list for an empty query', () => {
    const selected = ['Salary'];

    expect(commitTag('   ', selected, catalog)).toBe(selected);
  });

  it('uses the canonical Firefly casing when the tag is in the catalog', () => {
    expect(commitTag('  groceries  ', [], catalog)).toEqual(['Groceries']);
  });

  it('does not add a tag that is already selected', () => {
    const selected = ['Groceries'];

    expect(commitTag('GROCERIES', selected, catalog)).toBe(selected);
  });

  it('keeps the typed casing when the tag is new', () => {
    expect(commitTag(' New Tag ', ['Salary'], catalog)).toEqual([
      'Salary',
      'New Tag',
    ]);
  });
});
