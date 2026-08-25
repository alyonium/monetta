import type { EnTranslation } from './en.ts';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: EnTranslation;
    };
  }
}
