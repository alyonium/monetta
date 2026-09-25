import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import AccountIcon from '@/modules/budget/components/AccountIcon/AccountIcon.tsx';
import { resolveAccountIcon } from '@/modules/budget/components/accountIcons.ts';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants/appearance.ts';
import { formatAccountAmount } from '@/modules/budget/helpers/account/formatAccountAmount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountItemBody.module.css';

const AccountItemBody = ({ account }: { account: BudgetAccount }) => {
  const { t } = useTranslation();
  const color = account.color ?? DEFAULT_ACCOUNT_COLOR;
  const amount = (value: number) =>
    formatAccountAmount(value, account.currencySymbol, account.currencyCode);

  return (
    <>
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
    </>
  );
};

export default AccountItemBody;
