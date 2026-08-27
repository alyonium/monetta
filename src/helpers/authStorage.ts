import { normalizeBackendUrl } from '@/helpers/normalizeBackendUrl.ts';

export const ACCESS_TOKEN_KEY = 'monetta.token';
export const BACKEND_URL_KEY = 'monetta.backendUrl';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getBackendUrl = (): string | null =>
  localStorage.getItem(BACKEND_URL_KEY);

export const setBackendUrl = (url: string): void => {
  localStorage.setItem(BACKEND_URL_KEY, normalizeBackendUrl(url));
};
