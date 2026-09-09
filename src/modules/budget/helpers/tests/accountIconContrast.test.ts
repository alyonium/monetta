import { describe, expect, it } from 'vitest';
import {
  ACCOUNT_COLORS,
  ACCOUNT_DARK_INK_FILLS,
  DEFAULT_ACCOUNT_COLOR,
} from '@/modules/budget/constants.ts';
import {
  ACCOUNT_ICON_GLYPH_DARK,
  ACCOUNT_ICON_GLYPH_LIGHT,
  accountIconGlyphColor,
} from '@/modules/budget/helpers/accountIconContrast.ts';

describe('accountIconGlyphColor', () => {
  it('returns a black glyph on white, lime, and yellow fills', () => {
    expect(accountIconGlyphColor('#FFFFFF')).toBe(ACCOUNT_ICON_GLYPH_DARK);
    expect(accountIconGlyphColor('#ffffff')).toBe(ACCOUNT_ICON_GLYPH_DARK);
    expect(accountIconGlyphColor('#fff')).toBe(ACCOUNT_ICON_GLYPH_DARK);

    for (const fill of ACCOUNT_DARK_INK_FILLS) {
      expect(accountIconGlyphColor(fill)).toBe(ACCOUNT_ICON_GLYPH_DARK);
    }
  });

  it('returns a white glyph on indigo and black fills', () => {
    expect(accountIconGlyphColor(DEFAULT_ACCOUNT_COLOR)).toBe(
      ACCOUNT_ICON_GLYPH_LIGHT,
    );
    expect(accountIconGlyphColor('#000000')).toBe(ACCOUNT_ICON_GLYPH_LIGHT);
    expect(accountIconGlyphColor('#000')).toBe(ACCOUNT_ICON_GLYPH_LIGHT);
  });

  it('falls back to a white glyph when the color is not hex', () => {
    expect(accountIconGlyphColor('indigo')).toBe(ACCOUNT_ICON_GLYPH_LIGHT);
    expect(accountIconGlyphColor('')).toBe(ACCOUNT_ICON_GLYPH_LIGHT);
  });
});

describe('ACCOUNT_COLORS', () => {
  it('includes the default, white, and black swatches', () => {
    expect(ACCOUNT_COLORS).toContain(DEFAULT_ACCOUNT_COLOR);
    expect(ACCOUNT_COLORS).toContain('#FFFFFF');
    expect(ACCOUNT_COLORS).toContain('#000000');
  });

  it('keeps dark-ink fills on the same palette tokens', () => {
    for (const fill of ACCOUNT_DARK_INK_FILLS) {
      expect(ACCOUNT_COLORS).toContain(fill);
    }
  });
});
