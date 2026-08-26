import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACCESS_TOKEN_KEY,
  BACKEND_URL_KEY,
  getAccessToken,
  getBackendUrl,
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
    setBackendUrl('https://x.com/');

    expect(localStorage.getItem(BACKEND_URL_KEY)).toBe('https://x.com/api');
    expect(getBackendUrl()).toBe('https://x.com/api');
  });

  it('normalizes a stored URL that is missing /api', () => {
    localStorage.setItem(BACKEND_URL_KEY, 'http://127.0.0.1');

    expect(getBackendUrl()).toBe('http://127.0.0.1/api');
  });
});
