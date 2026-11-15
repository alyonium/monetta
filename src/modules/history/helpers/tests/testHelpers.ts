import { TransactionRead, TransactionSplit } from '@/api/types.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';

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
  pagination?: PagePagination,
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: createFireflyRequest('transactions'),
  response: new Response(null, { status: 200 }),
});
