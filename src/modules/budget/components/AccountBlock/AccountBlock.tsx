import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import AccountItem from '@/modules/budget/components/AccountItem/AccountItem.tsx';
import AddAccountButton from '@/modules/budget/components/AddAccountButton/AddAccountButton.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';
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

      <div className={styles.slot}>
        <ul
          className={clsx(
            styles.grid,
            type === ACCOUNT_TYPE.EXPENSE && styles.expense,
          )}
        >
          {accounts.map((account) => (
            <li key={account.id} className={styles.cell}>
              <AccountItem account={account} />
            </li>
          ))}

          <li className={styles.cell}>
            <AddAccountButton />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AccountBlock;
