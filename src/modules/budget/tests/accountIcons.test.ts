import { WalletIcon } from '@phosphor-icons/react';
import { describe, expect, it } from 'vitest';
import { resolveAccountIcon } from '@/modules/budget/components/accountIcons.ts';

describe('resolveAccountIcon', () => {
  it('returns the catalog icon for a known name', () => {
    expect(resolveAccountIcon('Wallet')).toBe(WalletIcon);
  });

  it('returns Wallet when the name is missing, blank, suffixed, or unknown', () => {
    expect(resolveAccountIcon(null)).toBe(WalletIcon);
    expect(resolveAccountIcon('')).toBe(WalletIcon);
    expect(resolveAccountIcon('   ')).toBe(WalletIcon);
    expect(resolveAccountIcon('WalletIcon')).toBe(WalletIcon);
    expect(resolveAccountIcon('NotAnIcon')).toBe(WalletIcon);
  });
});
