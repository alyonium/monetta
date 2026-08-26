import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { client } from '@/api/client.gen.ts';
import { setAccessToken, setBackendUrl } from '@/helpers/authStorage.ts';
import { configureApiClient } from '@/helpers/configureApiClient.ts';
import { stubLocalStorage } from '@/helpers/tests/stubLocalStorage.ts';

const DEMO_BASE_URL = 'https://demo.firefly-iii.org/api';

const restoreClient = () => {
  client.setConfig({
    baseUrl: DEMO_BASE_URL,
    headers: {
      Authorization: null,
      Accept: null,
    },
  });
};

const headerValue = (name: string): string | null => {
  const { headers } = client.getConfig();

  if (headers instanceof Headers) {
    return headers.get(name);
  }

  return null;
};

describe('configureApiClient', () => {
  beforeEach(() => {
    stubLocalStorage();
    restoreClient();
  });

  afterEach(() => {
    restoreClient();
    vi.unstubAllGlobals();
  });

  it('sets baseUrl, Bearer token, and Accept from saved credentials', () => {
    setAccessToken('pat-123');
    setBackendUrl('https://x.com/api/');

    configureApiClient();

    const { baseUrl } = client.getConfig();

    expect(baseUrl).toBe('https://x.com/api');
    expect(baseUrl?.endsWith('/')).toBe(false);
    expect(headerValue('Authorization')).toBe('Bearer pat-123');
    expect(headerValue('Accept')).toBe('application/json');
  });

  it('uses explicit token and backendUrl when passed', () => {
    configureApiClient({
      token: 'explicit-token',
      backendUrl: 'https://firefly.example.com/v1',
    });

    expect(client.getConfig().baseUrl).toBe('https://firefly.example.com/api');
    expect(headerValue('Authorization')).toBe('Bearer explicit-token');
    expect(headerValue('Accept')).toBe('application/json');
  });

  it('does not overwrite the demo config when credentials are missing', () => {
    configureApiClient();

    expect(client.getConfig().baseUrl).toBe(DEMO_BASE_URL);
    expect(headerValue('Authorization')).toBeNull();
  });

  it('does not overwrite the demo config when only a token is present', () => {
    setAccessToken('pat-123');

    configureApiClient();

    expect(client.getConfig().baseUrl).toBe(DEMO_BASE_URL);
    expect(headerValue('Authorization')).toBeNull();
  });
});
