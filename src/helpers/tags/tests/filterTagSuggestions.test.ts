import { describe, expect, it } from 'vitest';
import { TAG_SUGGESTIONS_LIMIT } from '@/helpers/tags/constants.ts';
import { filterTagSuggestions } from '@/helpers/tags/filterTagSuggestions.ts';

const catalog = [
  'Groceries',
  'Salary',
  'rent',
  'Travel',
  'Bills',
  'Coffee',
  'Gifts',
  'Health',
  'Pets',
  'Home',
  'Tax',
  'Extra',
];

describe('filterTagSuggestions', () => {
  it('returns catalog order without a text filter', () => {
    expect(filterTagSuggestions(catalog, '   ', [])).toEqual(
      catalog.slice(0, TAG_SUGGESTIONS_LIMIT),
    );
  });

  it('filters case-insensitively and excludes selected tags', () => {
    expect(
      filterTagSuggestions(catalog, '  GR  ', ['salary', 'gifts']),
    ).toEqual(['Groceries']);
  });

  it('keeps Firefly order and caps the list at the suggestion limit', () => {
    expect(filterTagSuggestions(catalog, '', ['Home'])).toEqual([
      'Groceries',
      'Salary',
      'rent',
      'Travel',
      'Bills',
      'Coffee',
      'Gifts',
      'Health',
      'Pets',
      'Tax',
    ]);
  });
});
