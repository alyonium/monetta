import type { TagRead } from '@/api/types.gen.ts';

export const createRequest = () =>
  new Request('https://demo.firefly-iii.org/api/v1/tags');

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
  request: createRequest(),
  response: new Response(null, { status: 200 }),
});
