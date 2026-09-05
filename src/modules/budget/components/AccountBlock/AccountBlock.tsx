import { useTranslation } from 'react-i18next';
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
        <ul className={styles.names}>
          {accounts.map((account) => (
            <li key={account.id}>{account.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AccountBlock;
