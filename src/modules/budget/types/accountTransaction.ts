import { TransactionTypeProperty } from '@/api/types.gen.ts';

export type AccountTransaction = {
  id: string;
  journalId: string | null;
  date: string;
  dateTime: string;
  description: string;
  sourceId: string;
  destinationId: string;
  sourceName: string;
  destinationName: string;
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  foreignAmount: number | null;
  foreignCurrencyCode: string;
  type: TransactionTypeProperty;
  tags: string[];
};

export type AccountTransactionGroup = {
  date: string;
  label: string;
  items: AccountTransaction[];
};
