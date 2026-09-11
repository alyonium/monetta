import { ACCOUNT_DARK_INK_FILLS } from '@/modules/budget/constants.ts';

export const ACCOUNT_ICON_GLYPH_DARK = '#000000';
export const ACCOUNT_ICON_GLYPH_LIGHT = '#FFFFFF';

const HEX_SHORT = /^#([0-9a-f]{3})$/i;
const HEX_LONG = /^#([0-9a-f]{6})$/i;

export const normalizeAccountColorHex = (hex: string): string | null => {
  const short = HEX_SHORT.exec(hex);
  const long = HEX_LONG.exec(hex);
  const digits = long?.[1] ?? (short ? short[1].replace(/(.)/g, '$1$1') : null);

  return digits ? `#${digits.toLowerCase()}` : null;
};

const DARK_INK_FILLS = new Set(
  ACCOUNT_DARK_INK_FILLS.flatMap((hex) => {
    const normalized = normalizeAccountColorHex(hex);

    return normalized ? [normalized] : [];
  }),
);

export const accountIconGlyphColor = (hex: string): string => {
  const normalized = normalizeAccountColorHex(hex);

  return normalized && DARK_INK_FILLS.has(normalized)
    ? ACCOUNT_ICON_GLYPH_DARK
    : ACCOUNT_ICON_GLYPH_LIGHT;
};
