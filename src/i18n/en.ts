export const en = {
  app: {
    name: 'Monetta',
    hello: 'Hello, {{name}}',
  },
} as const;

export type EnTranslation = typeof en;
