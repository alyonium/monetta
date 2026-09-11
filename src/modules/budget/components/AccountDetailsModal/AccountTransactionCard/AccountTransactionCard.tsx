import { Text } from '@mantine/core';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_TRANSACTION_FLOW } from '@/modules/budget/constants/transactions.ts';
import {
  accountTransactionFlow,
  type AccountTransactionFlow,
} from '@/modules/budget/helpers/accountTransactionFlow.ts';
import { formatAccountAmount } from '@/modules/budget/helpers/formatAccountAmount.ts';
import type { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountTransactionCard.module.css';

type AccountTransactionCardProps = {
  account: Pick<BudgetAccount, 'id' | 'name'>;
  transaction: AccountTransaction;
};

const amountClass = (
  flow: AccountTransactionFlow | null,
): string | undefined => {
  if (flow === null) {
    return undefined;
  }

  switch (flow) {
    case ACCOUNT_TRANSACTION_FLOW.IN:
      return styles.in;
    case ACCOUNT_TRANSACTION_FLOW.OUT:
      return styles.out;
    default: {
      const unexpectedFlow: never = flow;
      return unexpectedFlow;
    }
  }
};

const AccountTransactionCard = ({
  account,
  transaction,
}: AccountTransactionCardProps) => {
  const { t } = useTranslation();
  const flow = accountTransactionFlow(transaction, account);

  return (
    <div className={styles.card}>
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

        {transaction.description && (
          <Text c='dimmed' size='sm'>
            {transaction.description}
          </Text>
        )}
      </div>

      <Text className={clsx(styles.amount, amountClass(flow))} size='sm'>
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
