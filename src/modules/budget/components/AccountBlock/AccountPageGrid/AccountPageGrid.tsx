import type { CSSProperties } from 'react';
import AccountItem from '@/modules/budget/components/AccountItem/AccountItem.tsx';
import AddAccountButton from '@/modules/budget/components/AddAccountButton/AddAccountButton.tsx';
import { ACCOUNT_CARD_MIN_HEIGHT_DEFAULT } from '@/modules/budget/constants.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountPageGrid.module.css';

type AccountPageGridProps = {
  items: AccountPageItem[];
  columns: number;
  minHeight?: string;
  onAddAccount: () => void;
  onSelectAccount: (account: BudgetAccount) => void;
};

const AccountPageGrid = ({
  items,
  columns,
  minHeight = ACCOUNT_CARD_MIN_HEIGHT_DEFAULT,
  onAddAccount,
  onSelectAccount,
}: AccountPageGridProps) => (
  <ul
    className={styles.grid}
    style={
      {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        '--account-card-min-height': minHeight,
      } as CSSProperties
    }
  >
    {items.map((item) =>
      item.type === 'add' ? (
        <li key='add' className={styles.cell}>
          <AddAccountButton onClick={onAddAccount} />
        </li>
      ) : (
        <li key={item.account.id} className={styles.cell}>
          <AccountItem
            account={item.account}
            onSelectAccount={onSelectAccount}
          />
        </li>
      ),
    )}
  </ul>
);

export default AccountPageGrid;
