import { type CSSProperties, useLayoutEffect, useState } from 'react';
import AddAccountButton from '@/modules/budget/components/AddAccountButton/AddAccountButton.tsx';
import AccountItem from '@/modules/budget/components/AccountItem/AccountItem.tsx';
import InteractiveAccountItem from '@/modules/budget/components/AccountItem/InteractiveAccountItem.tsx';
import { ACCOUNT_CARD_MIN_HEIGHT_DEFAULT } from '@/modules/budget/constants/layout.ts';
import { cellPosition } from '@/modules/budget/helpers/layout/insertionShift.ts';
import type { AccountPageItem } from '@/modules/budget/types/accountPageItem.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountPageGrid.module.css';

type AccountPageGridProps = {
  items: AccountPageItem[];
  columns: number;
  minHeight?: string;
  onAddAccount: () => void;
  onSelectAccount: (account: BudgetAccount) => void;
  interactive?: boolean;
  editing?: boolean;
  preview?: AccountPageItem[] | null;
  activeId?: string | null;
  pulledFrom?: 'previous' | 'next' | null;
};

const accountsIn = (items: AccountPageItem[]): BudgetAccount[] =>
  items.flatMap((item) => (item.type === 'account' ? [item.account] : []));

const cellTranslate = (
  from: { column: number; row: number },
  to: { column: number; row: number },
): CSSProperties | undefined => {
  const column = to.column - from.column;
  const row = to.row - from.row;

  if (column === 0 && row === 0) {
    return undefined;
  }

  return {
    zIndex: 1,
    '--account-shift-x': String(column),
    '--account-shift-y': String(row),
  } as CSSProperties;
};

const shiftStyle = (
  index: number,
  previewIndex: number,
  columns: number,
  pulledFrom: 'previous' | 'next' | null,
): CSSProperties | undefined => {
  const from = cellPosition(index, columns);
  const to =
    previewIndex >= 0
      ? cellPosition(previewIndex, columns)
      : cellPosition(
          index,
          columns,
          pulledFrom === 'next' ? 'next' : 'previous',
        );

  if (!from || !to) {
    return undefined;
  }

  return cellTranslate(from, to);
};

type EnteringAccountProps = {
  account: BudgetAccount;
  index: number;
  columns: number;
  pulledFrom: 'previous' | 'next' | null;
  overlay: boolean;
};

const EnteringAccount = ({
  account,
  index,
  columns,
  pulledFrom,
  overlay,
}: EnteringAccountProps) => {
  const [placed, setPlaced] = useState(false);
  const land = cellPosition(index, columns);
  const outside = cellPosition(
    index,
    columns,
    pulledFrom === 'next' ? 'next' : 'previous',
  );

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setPlaced(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!land || !outside) {
    return null;
  }

  const shift = placed ? undefined : cellTranslate(land, outside);

  if (!overlay) {
    return <AccountItem account={account} isDragging style={shift} />;
  }

  return (
    <div aria-hidden className={styles.entering} style={shift}>
      <AccountItem account={account} isDragging />
    </div>
  );
};

const AccountPageGrid = ({
  items,
  columns,
  minHeight = ACCOUNT_CARD_MIN_HEIGHT_DEFAULT,
  onAddAccount,
  onSelectAccount,
  interactive = true,
  editing = false,
  preview = null,
  activeId = null,
  pulledFrom = null,
}: AccountPageGridProps) => {
  const previewAccounts = preview ? accountsIn(preview) : [];
  const pageAccounts = accountsIn(items);
  const enteringIndex = previewAccounts.findIndex(
    (account) =>
      account.id === activeId &&
      pageAccounts.every((pageAccount) => pageAccount.id !== account.id),
  );
  const entering =
    enteringIndex >= 0 ? previewAccounts[enteringIndex] : undefined;

  return (
    <ul
      className={styles.grid}
      style={
        {
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          '--account-card-min-height': minHeight,
        } as CSSProperties
      }
    >
      {items.map((item) => {
        if (item.type === 'add') {
          return (
            <li key='add' className={styles.cell}>
              <AddAccountButton onClick={onAddAccount} />
            </li>
          );
        }

        const index = pageAccounts.findIndex(
          (account) => account.id === item.account.id,
        );

        return (
          <li key={item.account.id} className={styles.cell}>
            {interactive ? (
              <InteractiveAccountItem
                account={item.account}
                editing={editing}
                onSelectAccount={onSelectAccount}
                style={
                  preview
                    ? shiftStyle(
                        index,
                        previewAccounts.findIndex(
                          (account) => account.id === item.account.id,
                        ),
                        columns,
                        pulledFrom,
                      )
                    : undefined
                }
              />
            ) : (
              <AccountItem account={item.account} />
            )}
            {entering && enteringIndex === index && (
              <EnteringAccount
                key={`${entering.id}:${enteringIndex}:${pulledFrom ?? ''}`}
                account={entering}
                index={enteringIndex}
                columns={columns}
                pulledFrom={pulledFrom}
                overlay
              />
            )}
          </li>
        );
      })}
      {entering && enteringIndex >= pageAccounts.length && (
        <li key={entering.id} aria-hidden className={styles.cell}>
          <EnteringAccount
            key={`${entering.id}:${enteringIndex}:${pulledFrom ?? ''}`}
            account={entering}
            index={enteringIndex}
            columns={columns}
            pulledFrom={pulledFrom}
            overlay={false}
          />
        </li>
      )}
    </ul>
  );
};

export default AccountPageGrid;
