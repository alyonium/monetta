import { describe, expect, it } from 'vitest';
import { cellPosition } from '@/modules/budget/helpers/layout/insertionShift.ts';

describe('cellPosition', () => {
  it('places an index on its column and row', () => {
    expect(cellPosition(1, 4)).toEqual({ column: 1, row: 0 });
    expect(cellPosition(5, 4)).toEqual({ column: 1, row: 1 });
  });

  it('steps one column past the page edge', () => {
    expect(cellPosition(0, 4, 'previous')).toEqual({ column: -1, row: 0 });
    expect(cellPosition(3, 4, 'next')).toEqual({ column: 4, row: 0 });
  });
});
