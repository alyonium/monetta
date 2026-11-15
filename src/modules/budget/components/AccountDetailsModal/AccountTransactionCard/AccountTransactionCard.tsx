import { Text } from '@mantine/core';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { onEnterOrSpace } from '@/helpers/onEnterOrSpace.ts';
import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants/transactions.ts';
import { formatAccountAmount } from '@/modules/budget/helpers/account/formatAccountAmount.ts';
import {
  accountTransactionFlow,
  type AccountTransactionFlow,
} from '@/modules/budget/helpers/transactions/accountTransactionFlow.ts';
import {
  isEditableAccountTransaction,
  type EditableAccountTransaction,
} from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import { hasTransactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountTransactionCard.module.css';

type AccountTransactionCardProps = {
  account: Pick<BudgetAccount, 'id' | 'name'>;
  transaction: AccountTransaction;
  onSelect?: (transaction: EditableAccountTransaction) => void;
};

const AMOUNT_CLASS: Record<AccountTransactionFlow, string> = {
  [ACCOUNT_TRANSACTION_FLOW.IN]: styles.in,
  [ACCOUNT_TRANSACTION_FLOW.OUT]: styles.out,
};

const AccountTransactionCard = ({
  account,
  transaction,
  onSelect,
}: AccountTransactionCardProps) => {
  const { t } = useTranslation();
  const flow = accountTransactionFlow(transaction, account);
  const onSelectTransaction =
    onSelect && isEditableAccountTransaction(transaction)
      ? () => onSelect(transaction)
      : undefined;

  return (
    <div
      className={clsx(styles.card, onSelectTransaction && styles.interactive)}
      role={onSelectTransaction ? 'button' : undefined}
      tabIndex={onSelectTransaction ? 0 : undefined}
      onClick={onSelectTransaction}
      onKeyDown={onSelectTransaction && onEnterOrSpace(onSelectTransaction)}
    >
      <div className={styles.details}>
        <div
          className={styles.route}
          aria-label={t('budget.accountDetails.route', {
            from: transaction.sourceName,
            to: transaction.destinationName,
          })}
        >
          <div className={styles.from}>
            <Text className={styles.name} span>
              {transaction.sourceName}
            </Text>

            <ArrowRightIcon aria-hidden className={styles.arrow} size={14} />
          </div>

          <Text className={styles.name} span>
            {transaction.destinationName}
          </Text>
        </div>

        {hasTransactionDescription(transaction.description) && (
          <Text c='dimmed' size='sm'>
            {transaction.description}
          </Text>
        )}
      </div>

      <Text
        className={clsx(styles.amount, flow && AMOUNT_CLASS[flow])}
        size='sm'
      >
        {formatAccountAmount(
          transaction.amount,
          transaction.currencySymbol,
          transaction.currencyCode,
        )}
      </Text>
    </div>
  );
};

export default AccountTransactionCard;
