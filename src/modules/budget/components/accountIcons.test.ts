import { BankIcon, PiggyBankIcon, WalletIcon } from '@phosphor-icons/react';
import { describe, expect, it } from 'vitest';
import {
  ACCOUNT_ICONS,
  isAccountIconName,
  resolveAccountIcon,
  toAccountIconName,
} from '@/modules/budget/components/accountIcons.ts';
import { DEFAULT_ACCOUNT_ICON } from '@/modules/budget/constants.ts';

describe('resolveAccountIcon', () => {
  it('returns the catalog icon for a known name', () => {
    expect(resolveAccountIcon('Wallet')).toBe(WalletIcon);
    expect(resolveAccountIcon('Bank')).toBe(BankIcon);
    expect(resolveAccountIcon('PiggyBank')).toBe(PiggyBankIcon);
  });

  it('returns Wallet when the name is missing, blank, suffixed, or unknown', () => {
    expect(resolveAccountIcon(null)).toBe(WalletIcon);
    expect(resolveAccountIcon('')).toBe(WalletIcon);
    expect(resolveAccountIcon('WalletIcon')).toBe(WalletIcon);
    expect(resolveAccountIcon('NotAnIcon')).toBe(WalletIcon);
  });
});

describe('toAccountIconName', () => {
  it('keeps a known catalog name', () => {
    expect(toAccountIconName('Bank')).toBe('Bank');
    expect(isAccountIconName('PiggyBank')).toBe(true);
  });

  it('falls back to Wallet when the name is missing, blank, suffixed, or unknown', () => {
    expect(toAccountIconName(null)).toBe(DEFAULT_ACCOUNT_ICON);
    expect(toAccountIconName('')).toBe(DEFAULT_ACCOUNT_ICON);
    expect(toAccountIconName('WalletIcon')).toBe(DEFAULT_ACCOUNT_ICON);
    expect(isAccountIconName('NotAnIcon')).toBe(false);
  });
});

describe('ACCOUNT_ICONS', () => {
  it('includes the default account icon', () => {
    expect(ACCOUNT_ICONS[DEFAULT_ACCOUNT_ICON]).toBe(WalletIcon);
  });
});
