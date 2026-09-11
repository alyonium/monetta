export const ACCOUNT_TYPE = {
  INCOME: 'INCOME',
  CURRENT: 'CURRENT',
  EXPENSE: 'EXPENSE',
} as const;

export const FIREFLY_ACCOUNT_TYPE = {
  REVENUE: 'revenue',
  ASSET: 'asset',
  EXPENSE: 'expense',
  LIABILITY: 'liability',
  LIABILITIES: 'liabilities',
} as const;

export const FIREFLY_ACCOUNT_ROLE = {
  DEFAULT_ASSET: 'defaultAsset',
} as const;

export const FIREFLY_LIABILITY_TYPE = {
  DEBT: 'debt',
} as const;

export const FIREFLY_LIABILITY_DIRECTION = {
  DEBIT: 'debit',
} as const;

export const FIREFLY_LIABILITY_INTEREST = '0';

export const FIREFLY_LIABILITY_INTEREST_PERIOD = {
  MONTHLY: 'monthly',
} as const;

export const CREATE_ACCOUNT_TITLE_KEY = {
  INCOME: 'budget.createAccount.title.income',
  CURRENT: 'budget.createAccount.title.current',
  EXPENSE: 'budget.createAccount.title.expense',
} as const satisfies Record<
  (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE],
  | 'budget.createAccount.title.income'
  | 'budget.createAccount.title.current'
  | 'budget.createAccount.title.expense'
>;

export const EDIT_ACCOUNT_TITLE_KEY = {
  INCOME: 'budget.editAccount.title.income',
  CURRENT: 'budget.editAccount.title.current',
  EXPENSE: 'budget.editAccount.title.expense',
} as const satisfies Record<
  (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE],
  | 'budget.editAccount.title.income'
  | 'budget.editAccount.title.current'
  | 'budget.editAccount.title.expense'
>;

export const EXPENSE_KIND = {
  EXPENSE: 'expense',
  DEBT: 'debt',
} as const;

export const EXPENSE_KIND_DATA = [
  {
    value: EXPENSE_KIND.EXPENSE,
    label: 'budget.createAccount.expense',
  },
  {
    value: EXPENSE_KIND.DEBT,
    label: 'budget.createAccount.debt',
  },
] as const;

export const CREATE_BUDGET_ACCOUNT_FAILURE_REASON = {
  NAME: 'name',
  FAILED: 'failed',
} as const;
