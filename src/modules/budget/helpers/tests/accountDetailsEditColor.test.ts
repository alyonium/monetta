import { DEFAULT_THEME } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import { accountDetailsEditColor } from '@/modules/budget/helpers/accountDetailsEditColor.ts';

describe('accountDetailsEditColor', () => {
  it('maps a fill shade 6 to the same palette shade 9', () => {
    expect(accountDetailsEditColor(DEFAULT_THEME.colors.pink[6])).toBe(
      DEFAULT_THEME.colors.pink[9],
    );
  });

  it('uses gray ends for white and black fills', () => {
    expect(accountDetailsEditColor('#FFFFFF')).toBe(
      DEFAULT_THEME.colors.gray[3],
    );
    expect(accountDetailsEditColor('#000000')).toBe(
      DEFAULT_THEME.colors.gray[9],
    );
  });

  it('falls back to indigo 9 when the color is unknown', () => {
    expect(accountDetailsEditColor('not-a-color')).toBe(
      DEFAULT_THEME.colors.indigo[9],
    );
  });
});
