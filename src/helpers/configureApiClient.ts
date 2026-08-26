import { client } from '@/api/client.gen.ts';
import { getAccessToken, getBackendUrl } from '@/helpers/authStorage.ts';
import { normalizeBackendUrl } from '@/helpers/normalizeBackendUrl.ts';

type ConfigureApiClientOptions = {
  token?: string;
  backendUrl?: string;
};

export const configureApiClient = (
  options?: ConfigureApiClientOptions,
): void => {
  const token = options?.token ?? getAccessToken();
  const backendUrl = options?.backendUrl ?? getBackendUrl();

  if (!token || !backendUrl) {
    return;
  }

  client.setConfig({
    baseUrl: normalizeBackendUrl(backendUrl),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};
