import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import { getCurrentUser } from '@/api/sdk.gen.ts';
import { client } from '@/api/client.gen.ts';
import { ACCESS_TOKEN_KEY, BACKEND_URL_KEY } from '@/helpers/authStorage.ts';
import { stubLocalStorage } from '@/helpers/tests/stubLocalStorage.ts';
import { LOGIN_FAILURE_REASON } from '@/modules/login/constants.ts';
import { verifyFireflyLogin } from '@/modules/login/helpers/verifyFireflyLogin.ts';

vi.mock('@/api/sdk.gen.ts', () => ({
  getCurrentUser: vi.fn(),
}));

type CurrentUserMockResult = {
  data?: unknown;
  error?: unknown;
  request: Request;
  response?: Response;
};

const getCurrentUserMock = getCurrentUser as unknown as Mock<
  () => Promise<CurrentUserMockResult>
>;
const DEMO_BASE_URL = 'https://demo.firefly-iii.org/api';
const USER_URL = `${DEMO_BASE_URL}/v1/about/user`;

const restoreClient = () => {
  client.setConfig({
    baseUrl: DEMO_BASE_URL,
    headers: {
      Authorization: null,
      Accept: null,
    },
  });
};

const mockRequest = () => new Request(USER_URL);

const resolveCurrentUser = (
  result: Omit<CurrentUserMockResult, 'request'> &
    Partial<Pick<CurrentUserMockResult, 'request'>>,
) => {
  getCurrentUserMock.mockResolvedValue({
    request: mockRequest(),
    ...result,
  });
};

describe('verifyFireflyLogin', () => {
  beforeEach(() => {
    stubLocalStorage();
    restoreClient();
    getCurrentUserMock.mockReset();
  });

  afterEach(() => {
    restoreClient();
    vi.unstubAllGlobals();
  });

  it('persists the token and normalized URL when getCurrentUser returns data', async () => {
    resolveCurrentUser({
      data: { id: '1' },
      response: new Response(null, { status: 200 }),
    });

    const result = await verifyFireflyLogin({
      token: 'pat-123',
      backendUrl: 'https://firefly.example.com/v1',
    });

    expect(result).toEqual({ ok: true });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('pat-123');
    expect(localStorage.getItem(BACKEND_URL_KEY)).toBe(
      'https://firefly.example.com/api',
    );
  });

  it('returns invalidToken for 401 and does not write storage', async () => {
    resolveCurrentUser({
      data: undefined,
      error: { message: 'Unauthenticated' },
      response: new Response(null, { status: 401 }),
    });

    const result = await verifyFireflyLogin({
      token: 'bad-token',
      backendUrl: 'https://firefly.example.com',
    });

    expect(result).toEqual({
      ok: false,
      reason: LOGIN_FAILURE_REASON.INVALID_TOKEN,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(BACKEND_URL_KEY)).toBeNull();
  });

  it('returns invalidToken for 403 and does not write storage', async () => {
    resolveCurrentUser({
      data: undefined,
      error: { message: 'Forbidden' },
      response: new Response(null, { status: 403 }),
    });

    const result = await verifyFireflyLogin({
      token: 'bad-token',
      backendUrl: 'https://firefly.example.com',
    });

    expect(result).toEqual({
      ok: false,
      reason: LOGIN_FAILURE_REASON.INVALID_TOKEN,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(BACKEND_URL_KEY)).toBeNull();
  });

  it('returns invalidBackendUrl when the response is missing', async () => {
    resolveCurrentUser({
      data: undefined,
      error: new TypeError('Failed to fetch'),
      response: undefined,
    });

    const result = await verifyFireflyLogin({
      token: 'pat-123',
      backendUrl: 'https://firefly.example.com',
    });

    expect(result).toEqual({
      ok: false,
      reason: LOGIN_FAILURE_REASON.INVALID_BACKEND_URL,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('returns invalidBackendUrl when getCurrentUser throws TypeError', async () => {
    getCurrentUserMock.mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await verifyFireflyLogin({
      token: 'pat-123',
      backendUrl: 'https://firefly.example.com',
    });

    expect(result).toEqual({
      ok: false,
      reason: LOGIN_FAILURE_REASON.INVALID_BACKEND_URL,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('returns invalidBackendUrl when the body is HTML instead of JSON', async () => {
    getCurrentUserMock.mockRejectedValue(
      new SyntaxError('Unexpected token < in JSON at position 0'),
    );

    const result = await verifyFireflyLogin({
      token: 'pat-123',
      backendUrl: 'https://example.com',
    });

    expect(result).toEqual({
      ok: false,
      reason: LOGIN_FAILURE_REASON.INVALID_BACKEND_URL,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });
});
