import { listTag } from '@/api/sdk.gen.ts';
import type { TagRead } from '@/api/types.gen.ts';
import { collectFireflyPages } from '@/helpers/collectFireflyPages.ts';
import {
  TAGS_MISSING_ERROR,
  TAGS_PAGE_LIMIT,
} from '@/helpers/tags/constants.ts';

const mapTag = (item: TagRead): string | null => {
  const tag = item.attributes?.tag?.trim();

  if (!tag) {
    return null;
  }

  return tag;
};

export const fetchTags = async (): Promise<string[]> => {
  const items = await collectFireflyPages(
    (page) =>
      listTag({
        query: { page, limit: TAGS_PAGE_LIMIT },
      }),
    TAGS_MISSING_ERROR,
  );

  const seen = new Set<string>();

  return items.reduce<string[]>((tags, item) => {
    const tag = mapTag(item);

    if (!tag) {
      return tags;
    }

    const key = tag.toLowerCase();

    if (seen.has(key)) {
      return tags;
    }

    seen.add(key);
    tags.push(tag);

    return tags;
  }, []);
};
