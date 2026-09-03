import type { AccountAppearance } from '@/modules/budget/types/budgetAccount.ts';

export const sampleAccountAppearance: AccountAppearance = {
  icon: 'Wallet',
  color: '#4C6EF5',
};

export const sampleAccountAppearanceJson = JSON.stringify(sampleAccountAppearance);
