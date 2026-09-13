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
    editAccount: {
      title: {
        income: 'Edit income account',
        current: 'Edit current account',
        expense: 'Edit expense account',
      },
      discard: 'Discard',
    },
    accountDetails: {
      edit: 'Edit account',
      close: 'Close',
      balance: 'Balance',
      debtAmount: 'Debt amount',
      paidAmount: 'Paid amount',
      search: 'Search',
      route: '{{from}} to {{to}}',
      noTransactions: 'No transactions found for this account',
      loading: 'Loading transactions',
      loadFailed: 'Failed to load transactions',
      delete: 'Delete',
      hide: 'Hide',
      deleteConfirm:
        'Do you want to delete the {{name}} account? This action cannot be undone.',
      deleteFailed: 'Could not delete the account',
      hideConfirm:
        'Do you want to hide the {{name}} account? You can get the selected account back through the Firefly interface.',
      hideFailed: 'Could not hide the account',
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
  tags: {
    label: 'Tags',
    placeholder: 'Search or create a tag',
    remove: 'Remove {{name}}',
    suggestions: 'Tag suggestions',
  },
} as const;

export type EnTranslation = typeof en;
