import { useTranslation } from 'react-i18next';
import AccountDetailsField from '@/modules/budget/components/AccountDetailsModal/AccountDetailsField/AccountDetailsField.tsx';
import {
  ACCOUNT_DETAILS_MONEY,
  type AccountDetailsMoney,
} from '@/modules/budget/helpers/account/accountDetailsHeader.ts';
import { formatAccountAmount } from '@/modules/budget/helpers/account/formatAccountAmount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountDetailsMoneyRow.module.css';

type AccountDetailsMoneyRowProps = {
  account: BudgetAccount;
  money: AccountDetailsMoney;
};

const AccountDetailsMoneyRow = ({
  account,
  money,
}: AccountDetailsMoneyRowProps) => {
  const { t } = useTranslation();
  const amount = (value: number) =>
    formatAccountAmount(value, account.currencySymbol, account.currencyCode);

  if (money === ACCOUNT_DETAILS_MONEY.BALANCE) {
    return (
      <div className={styles.row}>
        <AccountDetailsField
          className={styles.field}
          label={t('budget.accountDetails.balance')}
          value={amount(account.balance)}
        />
        <AccountDetailsField
          className={styles.currency}
          label={t('budget.createAccount.currency')}
          value={account.currencyCode}
        />
      </div>
    );
  }

  if (money === ACCOUNT_DETAILS_MONEY.DEBT) {
    return (
      <div className={styles.row}>
        <AccountDetailsField
          className={styles.field}
          label={t('budget.accountDetails.debtAmount')}
          value={amount(account.debtAmount ?? 0)}
        />
        <AccountDetailsField
          className={styles.field}
          label={t('budget.accountDetails.paidAmount')}
          value={amount(account.paidAmount ?? 0)}
        />
      </div>
    );
  }

  return null;
};

export default AccountDetailsMoneyRow;
