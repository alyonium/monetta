import { describe, expect, it } from 'vitest';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { createBudgetAccount } from '@/modules/budget/helpers/account/tests/testHelpers.ts';
import {
  dragComesFrom,
  previewAccountPage,
} from '@/modules/budget/helpers/layout/previewAccountPage.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';

const items: AccountPageItem[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(
  (id) => ({
    type: 'account',
    account: createBudgetAccount({ id, type: ACCOUNT_TYPE.CURRENT }),
  }),
);

const ids = (page: AccountPageItem[] | null) =>
  page?.map((item) => (item.type === 'account' ? item.account.id : item.type));

describe('previewAccountPage', () => {
  it('fills the dragged card place with the first card of the next page', () => {
    expect(ids(previewAccountPage(items, 0, 4, 'A', 'F'))).toEqual([
      'B',
      'C',
      'D',
      'E',
    ]);
  });

  it('lets that first card leave and shows the dragged card in the hovered slot', () => {
    expect(ids(previewAccountPage(items, 1, 4, 'A', 'E'))).toEqual([
      'A',
      'F',
      'G',
      'H',
    ]);
    expect(dragComesFrom(items, 1, 4, 'A')).toBe('previous');
  });
});
