import { TAG_SUGGESTIONS_LIMIT } from '@/helpers/tags/constants.ts';

export const filterTagSuggestions = (
  tags: string[],
  query: string,
  selected: string[],
  limit = TAG_SUGGESTIONS_LIMIT,
): string[] => {
  const trimmedQuery = query.trim().toLowerCase();
  const selectedKeys = new Set(selected.map((tag) => tag.toLowerCase()));

  return tags
    .filter((tag) => {
      if (selectedKeys.has(tag.toLowerCase())) {
        return false;
      }

      if (!trimmedQuery) {
        return true;
      }

      return tag.toLowerCase().includes(trimmedQuery);
    })
    .slice(0, limit);
};
