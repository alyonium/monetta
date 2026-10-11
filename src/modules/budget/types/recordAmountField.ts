import type { ReactNode } from 'react';

export type RecordAmountField = {
  label: string;
  amount: number | string;
  onAmountChange: (value: number | string) => void;
  error?: ReactNode;
  currency: string;
};
