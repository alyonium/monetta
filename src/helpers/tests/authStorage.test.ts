import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACCESS_TOKEN_KEY,
  BACKEND_URL_KEY,
  getAccessToken,
  getBackendUrl,
  hasAuthCredentials,
  setAccessToken,
  setBackendUrl,
} from '@/helpers/authStorage.ts';
import { stubLocalStorage } from '@/helpers/tests/stubLocalStorage.ts';

describe('authStorage', () => {
  beforeEach(() => {
    stubLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('writes and reads the access token', () => {
    expect(getAccessToken()).toBeNull();

    setAccessToken('pat-123');

    expect(getAccessToken()).toBe('pat-123');
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('pat-123');
  });

  it('normalizes the backend URL before writing', () => {
    setBackendUrl('https://x.com/firefly');

    expect(localStorage.getItem(BACKEND_URL_KEY)).toBe('https://x.com/api');
    expect(getBackendUrl()).toBe('https://x.com/api');
  });

  it('reports credentials when both keys are non-empty', () => {
    setAccessToken('pat-123');
    setBackendUrl('https://x.com');

    expect(hasAuthCredentials()).toBe(true);
  });

  it('rejects a missing token', () => {
    setBackendUrl('https://x.com');

    expect(hasAuthCredentials()).toBe(false);
  });

  it('rejects a missing backend URL', () => {
    setAccessToken('pat-123');

    expect(hasAuthCredentials()).toBe(false);
  });

  it('rejects an empty token or backend URL', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, '');
    localStorage.setItem(BACKEND_URL_KEY, 'https://x.com/api');

    expect(hasAuthCredentials()).toBe(false);

    localStorage.setItem(ACCESS_TOKEN_KEY, 'pat-123');
    localStorage.setItem(BACKEND_URL_KEY, '');

    expect(hasAuthCredentials()).toBe(false);
  });
});
