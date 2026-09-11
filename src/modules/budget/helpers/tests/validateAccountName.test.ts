import { describe, expect, it } from 'vitest';
import { validateAccountName } from '@/modules/budget/helpers/validateAccountName.ts';

describe('validateAccountName', () => {
  it('treats whitespace-only as empty and allows padded names', () => {
    expect(validateAccountName('  ')).toBe(
      'budget.createAccount.errors.nameRequired',
    );
    expect(validateAccountName(' Wallet ')).toBeUndefined();
  });
});
