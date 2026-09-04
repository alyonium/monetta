import type { Meta } from '@/api/types.gen.ts';

export type FireflyListPayload<T> = {
  data?: T[];
  meta?: Meta;
};

export type FireflyPageResult<T> = {
  data?: FireflyListPayload<T>;
};
