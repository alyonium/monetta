import { DEFAULT_THEME } from '@mantine/core';
import { normalizeAccountColorHex } from '@/modules/budget/helpers/appearance/accountIconContrast.ts';

const FILL_SHADE = 6;
const EDIT_SHADE = 9;

const ACCOUNT_CHROMATIC_COLORS = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const;

export const accountDetailsEditColor = (fillHex: string): string => {
  const fill = normalizeAccountColorHex(fillHex);

  if (!fill) {
    return DEFAULT_THEME.colors.indigo[EDIT_SHADE];
  }

  if (fill === '#ffffff') {
    return DEFAULT_THEME.colors.gray[3];
  }

  if (fill === '#000000') {
    return DEFAULT_THEME.colors.gray[9];
  }

  const palette = ACCOUNT_CHROMATIC_COLORS.find((name) => {
    const swatch = normalizeAccountColorHex(
      DEFAULT_THEME.colors[name][FILL_SHADE],
    );

    return swatch === fill;
  });

  if (palette) {
    return DEFAULT_THEME.colors[palette][EDIT_SHADE];
  }

  return DEFAULT_THEME.colors.indigo[EDIT_SHADE];
};
