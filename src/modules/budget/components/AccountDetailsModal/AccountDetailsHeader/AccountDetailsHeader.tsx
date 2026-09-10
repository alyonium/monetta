import { type CSSProperties } from 'react';
import { ActionIcon, Text } from '@mantine/core';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { resolveAccountIcon } from '@/modules/budget/components/accountIcons.ts';
import AccountDetailsField from '@/modules/budget/components/AccountDetailsModal/AccountDetailsField/AccountDetailsField.tsx';
import AccountDetailsGlyph from '@/modules/budget/components/AccountDetailsModal/AccountDetailsGlyph/AccountDetailsGlyph.tsx';
import AccountDetailsMoneyRow from '@/modules/budget/components/AccountDetailsModal/AccountDetailsMoneyRow/AccountDetailsMoneyRow.tsx';
import { DEFAULT_ACCOUNT_COLOR } from '@/modules/budget/constants.ts';
import { accountDetailsEditColor } from '@/modules/budget/helpers/accountDetailsEditColor.ts';
import { accountDetailsHeader } from '@/modules/budget/helpers/accountDetailsHeader.ts';
import { accountIconGlyphColor } from '@/modules/budget/helpers/accountIconContrast.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountDetailsHeader.module.css';

type AccountDetailsHeaderProps = {
  account: BudgetAccount;
};

const AccountDetailsHeader = ({ account }: AccountDetailsHeaderProps) => {
  const { t } = useTranslation();
  const color = account.color ?? DEFAULT_ACCOUNT_COLOR;
  const ink = accountIconGlyphColor(color);
  const edit = accountDetailsEditColor(color);
  const header = accountDetailsHeader(account.type, account.isDebt);

  return (
    <div
      className={styles.header}
      style={
        {
          '--account-details-color': color,
          '--account-details-ink': ink,
        } as CSSProperties
      }
    >
      <div className={styles.main}>
        <div className={styles.nameRow}>
          <AccountDetailsGlyph icon={resolveAccountIcon(account.icon)} />
          <Text className={styles.name}>{account.name}</Text>
        </div>

        {header.showKind && (
          <AccountDetailsField
            label={t('budget.createAccount.accountType')}
            value={
              account.isDebt
                ? t('budget.createAccount.debt')
                : t('budget.createAccount.expense')
            }
          />
        )}

        <AccountDetailsMoneyRow account={account} money={header.money} />
      </div>

      <ActionIcon
        aria-label={t('budget.accountDetails.edit')}
        autoContrast
        className={styles.edit}
        color={edit}
        radius='md'
        size='input-sm'
        type='button'
        variant='filled'
      >
        <PencilSimpleIcon aria-hidden size={18} />
      </ActionIcon>
    </div>
  );
};

export default AccountDetailsHeader;
