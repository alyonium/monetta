import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_BLOCK_PAGER } from '@/modules/budget/constants.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';
import AccountBlockPager from './AccountBlockPager/AccountBlockPager.tsx';
import styles from './AccountBlock.module.css';

const ACCOUNT_BLOCK_LABEL_KEY = {
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
  onAddAccount: () => void;
  onSelectAccount: (account: BudgetAccount) => void;
};

const AccountBlock = ({
  type,
  accounts,
  onAddAccount,
  onSelectAccount,
}: AccountBlockProps) => {
  const { t } = useTranslation();
  const layout = ACCOUNT_BLOCK_PAGER[type];

  return (
    <section
      className={clsx(styles.block, layout.fillHeight && styles.fill)}
      aria-label={t(ACCOUNT_BLOCK_LABEL_KEY[type])}
    >
      <AccountBlockPager
        accounts={accounts}
        onAddAccount={onAddAccount}
        onSelectAccount={onSelectAccount}
        {...layout}
      />
    </section>
  );
};

export default AccountBlock;
