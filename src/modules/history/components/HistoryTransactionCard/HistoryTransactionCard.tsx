import { Badge, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { hasTransactionDescription } from '@/modules/budget/helpers/transactions/transactionDescription.ts';
import { AccountTransaction } from '@/modules/budget/types/accountTransaction.ts';
import { historyTransactionAmount } from '@/modules/history/helpers/historyTransactionAmount.ts';
import { HISTORY_TRANSACTION_TYPE_KEY } from './constants.ts';
import styles from './HistoryTransactionCard.module.css';

type HistoryTransactionCardProps = {
  transaction: AccountTransaction;
};

const HistoryTransactionCard = ({
  transaction,
}: HistoryTransactionCardProps) => {
  const { t } = useTranslation();
  const amount = historyTransactionAmount(transaction);

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <div className={styles.line}>
          <Text c='dimmed' className={styles.label} size='sm' span>
            {t('history.from')}
          </Text>

          <Text className={styles.name} size='sm' span>
            {transaction.sourceName}
          </Text>
        </div>

        <div className={styles.line}>
          <Text c='dimmed' className={styles.label} size='sm' span>
            {t('history.to')}
          </Text>

          <Text className={styles.name} size='sm' span>
            {transaction.destinationName}
          </Text>
        </div>

        {hasTransactionDescription(transaction.description) && (
          <Text c='dimmed' size='sm'>
            {transaction.description}
          </Text>
        )}

        {transaction.tags.length > 0 && (
          <div className={styles.tags}>
            {transaction.tags.map((tag, index) => (
              <Badge
                key={`${tag}:${index}`}
                className={styles.tag}
                size='sm'
                variant='light'
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Text c='dimmed' size='xs'>
          {t(HISTORY_TRANSACTION_TYPE_KEY[transaction.type])}
        </Text>
      </div>

      <div className={styles.amounts}>
        {amount.kind === 'pair' ? (
          <>
            <Text className={styles.debited} size='sm'>
              {`− ${amount.debited}`}
            </Text>

            <Text className={styles.credited} size='sm'>
              {`+ ${amount.credited}`}
            </Text>
          </>
        ) : (
          <Text size='sm'>{amount.amount}</Text>
        )}
      </div>
    </div>
  );
};

export default HistoryTransactionCard;
