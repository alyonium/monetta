import type { WalletCurrency } from '@/helpers/currency/types.ts';

export const formatWalletAmount = (
  amount: number,
  currency: WalletCurrency,
): string => {
  const formatted = amount.toFixed(currency.decimalPlaces);
  const suffix = currency.symbol || currency.code;

  return suffix ? `${formatted} ${suffix}` : formatted;
};
