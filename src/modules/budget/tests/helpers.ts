import type {
  AccountRead,
  PreferenceRead,
  ShortAccountTypeProperty,
} from '@/api/types.gen.ts';

type PagePagination = { current_page: number; total_pages: number };

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

export const createPreference = (
  id: string,
  name: string,
  data: PreferenceRead['attributes']['data'],
): PreferenceRead => ({
  type: 'preferences',
  id,
  attributes: { name, data },
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
