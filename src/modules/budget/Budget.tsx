import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountBlock from '@/modules/budget/components/AccountBlock/AccountBlock.tsx';
import ParametersBar from '@/modules/budget/components/ParametersBar/ParametersBar.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/budgetMonth.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import styles from './Budget.module.css';

const Budget = () => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(todayIso()));
  const { data, isError } = useBudgetAccounts(month);

  return (
    <div className={styles.page}>
      <ParametersBar month={month} onMonthChange={setMonth} />

      {data ? (
        Object.values(ACCOUNT_TYPE).map((type) => (
          <AccountBlock key={type} type={type} accounts={data[type]} />
        ))
      ) : (
        <p className={styles.status}>
          {isError ? t('budget.errors.loadFailed') : t('budget.loading')}
        </p>
      )}
    </div>
  );
};

export default Budget;
