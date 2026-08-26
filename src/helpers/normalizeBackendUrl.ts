// Firefly SDK paths are `/v1/...`, so baseUrl must be the API root (`…/api`),
// not `…/api/v1`
export const normalizeBackendUrl = (url: string): string => {
  let result = url.trim();

  while (result.endsWith('/')) {
    result = result.slice(0, -1);
  }

  // Drop a trailing `/v1` so the client does not duplicate the version segment
  if (result.toLowerCase().endsWith('/v1')) {
    result = result.slice(0, result.length - '/v1'.length);

    while (result.endsWith('/')) {
      result = result.slice(0, -1);
    }
  }

  // Firefly's API lives under `/api`. Append it when the user omitted it.
  if (!result.toLowerCase().endsWith('/api')) {
    result = `${result}/api`;
  }

  return result;
};
