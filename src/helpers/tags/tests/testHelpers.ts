import { TagRead } from '@/api/types.gen.ts';
import { createFireflyRequest } from '@/helpers/tests/createFireflyRequest.ts';

export const createFireflyTag = (id: string, tag: string): TagRead => ({
  type: 'tags',
  id,
  attributes: { tag },
  links: {},
});

export const createTagPageResult = (
  data: TagRead[],
  pagination: { current_page: number; total_pages: number },
) => ({
  data: {
    data,
    meta: { pagination },
    links: {},
  },
  error: undefined,
  request: createFireflyRequest('tags'),
  response: new Response(null, { status: 200 }),
});
