import i18n, { type TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en.ts';

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
  },
});

export { i18n };

export const t: TFunction = i18n.t.bind(i18n);
