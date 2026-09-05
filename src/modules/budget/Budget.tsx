import { useTranslation } from 'react-i18next';
import AccountBlock from '@/modules/budget/components/AccountBlock/AccountBlock.tsx';
import ParametersBar from '@/modules/budget/components/ParametersBar/ParametersBar.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import styles from './Budget.module.css';

const Budget = () => {
  const { t } = useTranslation();
  const { data, isError } = useBudgetAccounts();

  if (!data) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>
          {isError ? t('budget.errors.loadFailed') : t('budget.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ParametersBar />

      {Object.values(ACCOUNT_TYPE).map((type) => (
        <AccountBlock key={type} type={type} accounts={data[type]} />
      ))}
    </div>
  );
};

export default Budget;
