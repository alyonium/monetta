import { TransactionRead, TransactionSplit } from '@/api/types.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';

type PagePagination = { current_page: number; total_pages: number };

export const createTransactionSplit = (
  extra: Partial<TransactionSplit> = {},
): TransactionSplit => ({
  type: 'withdrawal',
  date: '2026-01-15T12:00:00+00:00',
  amount: '10.00',
  description: '',
  source_id: '1',
  destination_id: '2',
  ...extra,
});

export const createFireflyTransaction = (
  id: string,
  splits: TransactionSplit[],
): TransactionRead => ({
  type: 'transactions',
  id,
  attributes: { transactions: splits },
  links: {},
});

export const createTransactionPageResult = (
  data: TransactionRead[],
  pagination: PagePagination,
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: createFireflyRequest('accounts/1/transactions'),
  response: new Response(null, { status: 200 }),
});

export const createAccountTransaction = (
  extra: Partial<AccountTransaction> = {},
): AccountTransaction => ({
  id: 'group-1',
  journalId: 'journal-1',
  date: '2026-01-15',
  dateTime: '2026-01-15T12:00:00+00:00',
  description: 'Groceries',
  sourceId: '1',
  destinationId: '2',
  sourceName: 'Wallet',
  destinationName: 'Shop',
  amount: 10,
  currencyCode: 'EUR',
  currencySymbol: '€',
  foreignAmount: null,
  foreignCurrencyCode: '',
  type: 'withdrawal',
  tags: [],
  ...extra,
});

export const createTransactionSingleResult = (transaction: TransactionRead) => ({
  data: {
    data: transaction,
  },
  error: undefined,
  request: createFireflyRequest('transactions'),
  response: new Response(null, { status: 200 }),
});

export const createMissingTransactionResult = (
  error: { message?: string } = {},
  status = 422,
) => ({
  data: undefined,
  error,
  request: createFireflyRequest('transactions'),
  response: new Response(null, { status }),
});
