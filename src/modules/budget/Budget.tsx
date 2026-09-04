import { useTranslation } from 'react-i18next';
import AccountNameList from '@/modules/budget/components/AccountNameList/AccountNameList.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';

const Budget = () => {
  const { t } = useTranslation();
  const { data, isError } = useBudgetAccounts();

  if (!data) {
    return (
      <p>{isError ? t('budget.errors.loadFailed') : t('budget.loading')}</p>
    );
  }

  return (
    <div>
      {Object.values(ACCOUNT_TYPE).map((type) => (
        <AccountNameList key={type} type={type} accounts={data[type]} />
      ))}
    </div>
  );
};

export default Budget;
