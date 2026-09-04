export const createPageResult = <T>(
  data: T[],
  pagination: { current_page: number; total_pages: number },
) => ({
  data: {
    data,
    meta: { pagination },
  },
});
