import { describe, expect, it } from 'vitest';
import { t } from '@/i18n/index.ts';

describe('i18n', () => {
  it('returns the English string for a known key', () => {
    expect(t('app.name')).toBe('Monetta');
  });

  it('interpolates {{name}}', () => {
    expect(t('app.hello', { name: 'Cash' })).toBe('Hello, Cash');
  });

  it('returns the key when the translation is missing', () => {
    // @ts-expect-error unknown keys are rejected at compile time
    expect(t('missing.key')).toBe('missing.key');
  });
});
