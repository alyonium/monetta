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
} as const;

export type EnTranslation = typeof en;
