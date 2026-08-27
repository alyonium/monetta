import { describe, expect, it } from 'vitest';
import { normalizeBackendUrl } from '@/helpers/normalizeBackendUrl.ts';

describe('normalizeBackendUrl', () => {
  it('trims whitespace and uses origin plus /api', () => {
    expect(normalizeBackendUrl('  https://x.com  ')).toBe('https://x.com/api');
  });

  it('drops path, /api, and /v1', () => {
    expect(normalizeBackendUrl('https://x.com/')).toBe('https://x.com/api');
    expect(normalizeBackendUrl('https://x.com/api')).toBe('https://x.com/api');
    expect(normalizeBackendUrl('https://x.com/api/v1/')).toBe(
      'https://x.com/api',
    );
    expect(normalizeBackendUrl('https://x.com/firefly/api')).toBe(
      'https://x.com/api',
    );
  });

  it('keeps scheme, host, and port', () => {
    expect(normalizeBackendUrl('http://127.0.0.1:8080/foo')).toBe(
      'http://127.0.0.1:8080/api',
    );
  });

  it('prefixes https when the scheme is missing', () => {
    expect(normalizeBackendUrl('firefly.example.com')).toBe(
      'https://firefly.example.com/api',
    );
  });
});
