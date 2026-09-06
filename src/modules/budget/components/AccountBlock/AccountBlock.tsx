import { useTranslation } from 'react-i18next';
import {
  ACCOUNT_BLOCK_MOBILE_COLUMNS,
  ACCOUNT_CARD_MIN_HEIGHT_EXPENSE,
  ACCOUNT_TYPE,
} from '@/modules/budget/constants.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';
import { toAccountPageItems } from './accountPageItem.ts';
import AccountBlockPager from './AccountBlockPager/AccountBlockPager.tsx';
import AccountPageGrid from './AccountPageGrid/AccountPageGrid.tsx';
import styles from './AccountBlock.module.css';

const ACCOUNT_BLOCK_TITLE_KEY = {
  INCOME: 'budget.income',
  CURRENT: 'budget.current',
  EXPENSE: 'budget.expense',
} as const satisfies Record<
  AccountType,
  'budget.income' | 'budget.current' | 'budget.expense'
>;

type AccountBlockProps = {
  type: AccountType;
  accounts: BudgetAccount[];
};

const AccountBlock = ({ type, accounts }: AccountBlockProps) => {
  const { t } = useTranslation();

  return (
    <section className={styles.block}>
      <h2 className={styles.title}>{t(ACCOUNT_BLOCK_TITLE_KEY[type])}</h2>

      {type === ACCOUNT_TYPE.EXPENSE ? (
        <div className={styles.slot}>
          <AccountPageGrid
            items={toAccountPageItems(accounts)}
            columns={ACCOUNT_BLOCK_MOBILE_COLUMNS}
            minHeight={ACCOUNT_CARD_MIN_HEIGHT_EXPENSE}
          />
        </div>
      ) : (
        <AccountBlockPager accounts={accounts} />
      )}
    </section>
  );
};

export default AccountBlock;
