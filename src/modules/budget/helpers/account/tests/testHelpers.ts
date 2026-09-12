import type {
  AccountRead,
  PreferenceRead,
  ShortAccountTypeProperty,
} from '@/api/types.gen.ts';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  ACCOUNT_APPEARANCE_PREFIX,
  ACCOUNT_ORDER_PREFIX,
} from '@/modules/budget/constants/queries.ts';
import type {
  AccountAppearance,
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';

type PagePagination = { current_page: number; total_pages: number };

export const sampleAccountAppearance: AccountAppearance = {
  icon: 'Wallet',
  color: '#4C6EF5',
};

export const sampleAccountAppearanceJson = JSON.stringify(sampleAccountAppearance);

export const appearancePreferenceKey = (accountId: string): string =>
  `${ACCOUNT_APPEARANCE_PREFIX}${accountId}`;

export const orderPreferenceKey = (type: AccountType): string =>
  `${ACCOUNT_ORDER_PREFIX}${type.toLowerCase()}`;

export const createRequest = (path: string) =>
  new Request(`https://demo.firefly-iii.org/api/v1/${path}`);

export const createFireflyAccount = (
  id: string,
  type: ShortAccountTypeProperty,
  name = id,
  extra: Partial<AccountRead['attributes']> = {},
): AccountRead => ({
  type: 'accounts',
  id,
  attributes: { name, type, ...extra },
});

export const createCurrentAccount = (
  id: string,
  balance: number,
  currencyCode: string,
): BudgetAccount => ({
  id,
  name: id,
  type: ACCOUNT_TYPE.CURRENT,
  isDebt: false,
  icon: null,
  color: null,
  balance,
  currencyCode,
  currencySymbol: '',
  debtAmount: null,
  paidAmount: null,
});

export const createPreference = (
  id: string,
  name: string,
  data: PreferenceRead['attributes']['data'],
): PreferenceRead => ({
  type: 'preferences',
  id,
  attributes: { name, data },
});

export const createAccountSingleResult = (account: AccountRead) => ({
  data: {
    data: account,
  },
  error: undefined,
  request: createRequest('accounts'),
  response: new Response(null, { status: 200 }),
});

export const createMissingAccountResult = (
  error: { message?: string; errors?: { name?: string[] } },
  status = 422,
) => ({
  data: undefined,
  error,
  request: createRequest('accounts'),
  response: new Response(null, { status }),
});

export const createDeletedAccountResult = (): {
  data: void;
  error: undefined;
  request: Request;
  response: Response;
} => ({
  data: undefined,
  error: undefined,
  request: createRequest('accounts'),
  response: new Response(null, { status: 204 }),
});

export const createPreferenceSingleResult = (
  name: string,
  data: PreferenceRead['attributes']['data'],
) => ({
  data: {
    data: createPreference('1', name, data),
  },
  error: undefined,
  request: createRequest('preferences/name'),
  response: new Response(null, { status: 200 }),
});

export const createMissingPreferenceResult = (
  status = 401,
  error: { message?: string } = {},
) => ({
  data: undefined,
  error,
  request: createRequest('preferences/name'),
  response: new Response(null, { status }),
});

export const createAccountPageResult = (
  data: AccountRead[],
  pagination: PagePagination,
) => ({
  data: {
    data,
    meta: { pagination },
  },
  error: undefined,
  request: createRequest('accounts'),
  response: new Response(null, { status: 200 }),
});

export const createPreferencePageResult = (
  data: PreferenceRead[],
  pagination: PagePagination,
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: createRequest('preferences'),
  response: new Response(null, { status: 200 }),
});

export const createEmptyPreferences = () =>
  createPreferencePageResult([], { current_page: 1, total_pages: 1 });
