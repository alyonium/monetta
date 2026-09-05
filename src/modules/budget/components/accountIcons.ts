import { WalletIcon, type Icon } from '@phosphor-icons/react';
import { DEFAULT_ACCOUNT_ICON } from '@/modules/budget/constants.ts';

export const ACCOUNT_ICONS = {
  [DEFAULT_ACCOUNT_ICON]: WalletIcon,
} as const satisfies Record<string, Icon>;

export type AccountIconName = keyof typeof ACCOUNT_ICONS;

const isAccountIconName = (name: string): name is AccountIconName =>
  name in ACCOUNT_ICONS;

export const resolveAccountIcon = (name: string | null): Icon => {
  const trimmed = name?.trim();

  if (trimmed && isAccountIconName(trimmed)) {
    return ACCOUNT_ICONS[trimmed];
  }

  return ACCOUNT_ICONS[DEFAULT_ACCOUNT_ICON];
};
