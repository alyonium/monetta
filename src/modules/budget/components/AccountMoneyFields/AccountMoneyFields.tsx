import { NumberInput, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { WalletCurrency } from '@/helpers/currency/types.ts';
import styles from './AccountMoneyFields.module.css';

type AccountMoneyFieldsProps = {
  initialBalance: number;
  onInitialBalanceChange: (value: number) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  currencies: WalletCurrency[];
};

const AccountMoneyFields = ({
  initialBalance,
  onInitialBalanceChange,
  currency,
  onCurrencyChange,
  currencies,
}: AccountMoneyFieldsProps) => {
  const { t } = useTranslation();
  const fieldClassNames = { label: styles.fieldLabel };

  return (
    <div className={styles.row}>
      <NumberInput
        className={styles.balance}
        label={t('budget.createAccount.initialBalance')}
        classNames={fieldClassNames}
        hideControls
        value={initialBalance}
        onChange={(value) =>
          onInitialBalanceChange(typeof value === 'number' ? value : 0)
        }
      />

      <Select
        className={styles.currency}
        label={t('budget.createAccount.currency')}
        classNames={fieldClassNames}
        data={currencies.map((item) => ({
          value: item.code,
          label: item.code,
        }))}
        disabled={currencies.length === 0}
        searchable
        value={currency}
        onChange={(value) => onCurrencyChange(value ?? '')}
      />
    </div>
  );
};

export default AccountMoneyFields;
