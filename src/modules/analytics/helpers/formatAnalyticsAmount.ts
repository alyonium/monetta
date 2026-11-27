import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';

export const ANALYTICS_AMOUNT_PLACEHOLDER = '—';

export const formatAnalyticsAmount = (
  amount: number | null,
  currency: WalletCurrency | null,
): string =>
  amount !== null && currency
    ? formatWalletAmount(amount, currency)
    : ANALYTICS_AMOUNT_PLACEHOLDER;
