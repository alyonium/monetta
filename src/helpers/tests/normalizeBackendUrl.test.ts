import { describe, expect, it } from 'vitest';
import { normalizeBackendUrl } from '@/helpers/normalizeBackendUrl.ts';

describe('normalizeBackendUrl', () => {
  it('trims whitespace and appends /api', () => {
    expect(normalizeBackendUrl('  https://x.com  ')).toBe('https://x.com/api');
  });

  it('strips trailing slashes', () => {
    expect(normalizeBackendUrl('https://x.com/')).toBe('https://x.com/api');
    expect(normalizeBackendUrl('https://x.com/api/')).toBe('https://x.com/api');
  });

  it('appends /api when the path does not end with it', () => {
    expect(normalizeBackendUrl('https://x.com')).toBe('https://x.com/api');
  });

  it('keeps an existing /api suffix', () => {
    expect(normalizeBackendUrl('https://x.com/api')).toBe('https://x.com/api');
    expect(normalizeBackendUrl('  http://127.0.0.1/api  ')).toBe(
      'http://127.0.0.1/api',
    );
  });

  it('treats /api as case-insensitive', () => {
    expect(normalizeBackendUrl('https://x.com/API')).toBe('https://x.com/API');
  });

  it('strips a trailing /v1 so the client does not double it', () => {
    expect(normalizeBackendUrl('https://x.com/v1')).toBe('https://x.com/api');
    expect(normalizeBackendUrl('https://x.com/api/v1')).toBe(
      'https://x.com/api',
    );
    expect(normalizeBackendUrl('https://x.com/api/v1/')).toBe(
      'https://x.com/api',
    );
  });
});
