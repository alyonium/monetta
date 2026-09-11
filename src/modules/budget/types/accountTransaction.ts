import type { TransactionTypeProperty } from '@/api/types.gen.ts';

export type AccountTransaction = {
  id: string;
  journalId: string;
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
  type: TransactionTypeProperty;
  tags: string[];
};

export type AccountTransactionGroup = {
  date: string;
  label: string;
  items: AccountTransaction[];
};
