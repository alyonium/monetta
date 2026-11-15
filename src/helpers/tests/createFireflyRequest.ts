export const FIREFLY_DEMO_BASE_URL = 'https://demo.firefly-iii.org/api';

export const createFireflyRequest = (path: string) =>
  new Request(`${FIREFLY_DEMO_BASE_URL}/v1/${path}`);
