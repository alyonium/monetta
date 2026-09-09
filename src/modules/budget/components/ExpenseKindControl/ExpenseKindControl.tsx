import { Input, SegmentedControl } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { EXPENSE_KIND, EXPENSE_KIND_DATA } from '@/modules/budget/constants.ts';

type ExpenseKindControlProps = {
  isDebt: boolean;
  onChange: (isDebt: boolean) => void;
};

const ExpenseKindControl = ({ isDebt, onChange }: ExpenseKindControlProps) => {
  const { t } = useTranslation();

  return (
    <Input.Wrapper label={t('budget.createAccount.accountType')}>
      <SegmentedControl
        fullWidth
        data={EXPENSE_KIND_DATA.map(({ value, label }) => ({
          value,
          label: t(label),
        }))}
        value={isDebt ? EXPENSE_KIND.DEBT : EXPENSE_KIND.EXPENSE}
        onChange={(value) => onChange(value === EXPENSE_KIND.DEBT)}
      />
    </Input.Wrapper>
  );
};

export default ExpenseKindControl;
