import type { TransactionRead, TransactionSplit } from '@/api/types.gen.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

type PagePagination = { current_page: number; total_pages: number };

export const createRequest = (path: string) =>
  new Request(`https://demo.firefly-iii.org/api/v1/${path}`);

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
  request: createRequest('accounts/1/transactions'),
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
  type: 'withdrawal',
  tags: [],
  ...extra,
});

export const createBudgetAccountFixture = (
  extra: Partial<BudgetAccount> & Pick<BudgetAccount, 'id' | 'type'>,
): BudgetAccount => ({
  name: extra.name ?? extra.id,
  isDebt: false,
  icon: null,
  color: null,
  balance: 0,
  currencyCode: 'EUR',
  currencySymbol: '€',
  debtAmount: null,
  paidAmount: null,
  ...extra,
});

export const createTransactionSingleResult = (transaction: TransactionRead) => ({
  data: {
    data: transaction,
  },
  error: undefined,
  request: createRequest('transactions'),
  response: new Response(null, { status: 200 }),
});

export const createMissingTransactionResult = (
  error: { message?: string } = {},
  status = 422,
) => ({
  data: undefined,
  error,
  request: createRequest('transactions'),
  response: new Response(null, { status }),
});
