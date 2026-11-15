import { FireflyPageResult } from '@/helpers/types/fireflyPages.ts';

export const collectFireflyPages = async <T>(
  fetchPage: (page: number) => Promise<FireflyPageResult<T>>,
  missingError: string,
): Promise<T[]> => {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await fetchPage(page).catch((error: unknown) => {
      throw error instanceof Error ? error : new Error(missingError);
    });
    const payload = result.data;
    const pageItems = payload?.data;

    if (!payload || !pageItems) {
      throw new Error(missingError);
    }

    items.push(...pageItems);
    totalPages = payload.meta?.pagination?.total_pages ?? page;
    page += 1;
  }

  return items;
};
