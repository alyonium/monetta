import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import AccountIcon from '@/modules/budget/components/AccountIcon/AccountIcon.tsx';
import { resolveAccountIcon } from '@/modules/budget/components/accountIcons.ts';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants.ts';
import { formatAccountAmount } from '@/modules/budget/helpers/formatAccountAmount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountItem.module.css';

type AccountItemProps = {
  account: BudgetAccount;
};

const AccountItem = ({ account }: AccountItemProps) => {
  const { t } = useTranslation();
  const color = account.color ?? DEFAULT_ACCOUNT_COLOR;
  const amount = (value: number) =>
    formatAccountAmount(value, account.currencySymbol, account.currencyCode);

  return (
    <div className={styles.card}>
      <p className={styles.name}>{account.name}</p>

      <AccountIcon icon={resolveAccountIcon(account.icon)} color={color} />

      {account.isDebt ? (
        <div className={styles.amounts}>
          <p className={clsx(styles.amount, styles.debtAmount)}>
            {amount(account.debtAmount ?? 0)}
          </p>
          <p className={clsx(styles.amount, styles.paidAmount)}>
            {t('budget.paid', { amount: amount(account.paidAmount ?? 0) })}
          </p>
        </div>
      ) : (
        <p className={styles.amount}>{amount(account.balance)}</p>
      )}
    </div>
  );
};

export default AccountItem;
