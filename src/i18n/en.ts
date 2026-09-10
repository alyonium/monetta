export const en = {
  app: {
    name: 'Monetta',
    hello: 'Hello, {{name}}',
  },
  login: {
    title: 'Welcome back!',
    subtitle: 'Log in to continue using Monetta',
    token: 'Token',
    backendUrl: 'Backend URL',
    signIn: 'Sign in',
    backendUrlPlaceholder: 'https://firefly.example.com',
    fireflyCredit:
      'Monetta is an interface for <fireflyLink>Firefly III</fireflyLink>',
    errors: {
      tokenRequired: 'Token is required',
      backendUrlRequired: 'Backend URL is required',
      invalidToken: 'Invalid token',
      invalidBackendUrl: 'Invalid backend URL',
      unexpected: 'Unexpected error',
    },
  },
  nav: {
    budget: 'Budget',
    history: 'History',
    analytics: 'Analytics',
    settings: 'Settings',
  },
  budget: {
    income: 'Income',
    current: 'Current',
    expense: 'Expense',
    addAccount: 'Add',
    iconPicker: {
      title: 'Select account icon',
      open: 'Open icon picker',
    },
    createAccount: {
      title: {
        income: 'Create income account',
        current: 'Create current account',
        expense: 'Create expense account',
      },
      name: 'Account name',
      initialBalance: 'Initial balance',
      currency: 'Currency',
      color: 'Account color',
      accountType: 'Account type',
      expense: 'Expense',
      debt: 'Debt',
      cancel: 'Cancel',
      save: 'Save',
      errors: {
        nameRequired: 'Account name is required',
        currencyRequired: 'Currency is required',
        saveFailed: 'Could not save the account',
      },
    },
    accountDetails: {
      edit: 'Edit account',
      close: 'Close',
      balance: 'Balance',
      debtAmount: 'Debt amount',
      paidAmount: 'Paid amount',
      search: 'Search',
      transactionsPlaceholder: 'Transaction history',
      delete: 'Delete',
      hide: 'Hide',
    },
    paid: 'Paid {{amount}}',
    pagination: {
      previous: 'Previous page',
      next: 'Next page',
      pages: 'Pages',
      page: 'Page {{page}}',
    },
    loading: 'Loading accounts',
    parameters: {
      income: 'Income',
      expenses: 'Expenses',
      balance: 'Balance',
      month: 'Month',
      edit: 'Edit',
    },
    errors: {
      loadFailed: 'Failed to load accounts',
    },
  },
} as const;

export type EnTranslation = typeof en;
