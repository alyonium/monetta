import { getCurrentUser } from '@/api/sdk.gen.ts';
import { setAccessToken, setBackendUrl } from '@/helpers/authStorage.ts';
import { configureApiClient } from '@/helpers/configureApiClient.ts';
import { LOGIN_FAILURE_REASON } from '@/modules/login/constants.ts';
import type {
  VerifyFireflyLoginInput,
  VerifyFireflyLoginResult,
} from '@/modules/login/types/verifyFireflyLogin.ts';

export const verifyFireflyLogin = async ({
  token,
  backendUrl,
}: VerifyFireflyLoginInput): Promise<VerifyFireflyLoginResult> => {
  try {
    configureApiClient({ token, backendUrl });
    const result = await getCurrentUser();

    if (result.data) {
      setAccessToken(token);
      setBackendUrl(backendUrl);
      return { ok: true };
    }

    const status = result.response?.status;

    if (status === 401 || status === 403) {
      return { ok: false, reason: LOGIN_FAILURE_REASON.INVALID_TOKEN };
    }

    return { ok: false, reason: LOGIN_FAILURE_REASON.INVALID_BACKEND_URL };
  } catch {
    return { ok: false, reason: LOGIN_FAILURE_REASON.INVALID_BACKEND_URL };
  }
};
