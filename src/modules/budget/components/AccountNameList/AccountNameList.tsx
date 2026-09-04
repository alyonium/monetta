import { useTranslation } from 'react-i18next';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';

type AccountNameListProps = {
  type: AccountType;
  accounts: BudgetAccount[];
};

const AccountNameList = ({ type, accounts }: AccountNameListProps) => {
  const { t } = useTranslation();

  return (
    <section>
      <h2>{t(`budget.${type.toLowerCase() as Lowercase<AccountType>}`)}</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </section>
  );
};

export default AccountNameList;
