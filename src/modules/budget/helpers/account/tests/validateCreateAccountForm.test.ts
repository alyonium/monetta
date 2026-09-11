import { describe, expect, it } from 'vitest';
import { validateCreateAccountForm } from '@/modules/budget/helpers/account/validateCreateAccountForm.ts';

describe('validateCreateAccountForm', () => {
  it('requires a non-empty trimmed name', () => {
    expect(validateCreateAccountForm({ name: '  ', currency: 'EUR' }, false)).toEqual({
      name: 'budget.createAccount.errors.nameRequired',
    });
    expect(validateCreateAccountForm({ name: '', currency: '' }, false)).toEqual({
      name: 'budget.createAccount.errors.nameRequired',
    });
  });

  it('requires currency only when money fields are shown', () => {
    expect(
      validateCreateAccountForm({ name: 'Wallet', currency: '' }, true),
    ).toEqual({
      currency: 'budget.createAccount.errors.currencyRequired',
    });
    expect(
      validateCreateAccountForm({ name: 'Salary', currency: '' }, false),
    ).toEqual({});
  });

  it('accepts a named current or debt form with a currency', () => {
    expect(
      validateCreateAccountForm({ name: 'Wallet', currency: 'EUR' }, true),
    ).toEqual({});
  });
});
