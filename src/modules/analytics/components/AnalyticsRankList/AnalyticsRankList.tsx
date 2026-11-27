import { Text } from '@mantine/core';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { formatWalletAmount } from '@/helpers/currency/formatWalletAmount.ts';
import { WalletCurrency } from '@/helpers/currency/types.ts';
import { RANK_SIGN } from '@/modules/analytics/constants/rankSign.ts';
import { ANALYTICS_AMOUNT_PLACEHOLDER } from '@/modules/analytics/helpers/formatAnalyticsAmount.ts';
import { AnalyticsCategory } from '@/modules/analytics/types/analytics.ts';
import { AnalyticsRankItem } from '@/modules/analytics/types/analyticsBreakdown.ts';
import styles from './AnalyticsRankList.module.css';

type AnalyticsRankListProps = {
  category: AnalyticsCategory;
  currency: WalletCurrency | null;
  items: AnalyticsRankItem[];
  label: string;
};

const AnalyticsRankList = ({
  category,
  currency,
  items,
  label,
}: AnalyticsRankListProps) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <Text c='dimmed' className={styles.empty} size='sm'>
        {t('analytics.empty')}
      </Text>
    );
  }

  return (
    <ul aria-label={label} className={styles.list}>
      {items.map((item) => (
        <li className={styles.card} key={item.id}>
          <Text className={styles.name} size='sm'>
            {item.name}
          </Text>
          <div className={styles.figures}>
            <Text
              className={clsx(styles.amount, styles[category])}
              fw={600}
              size='sm'
            >
              {currency
                ? `${RANK_SIGN[category]} ${formatWalletAmount(item.amount, currency)}`
                : ANALYTICS_AMOUNT_PLACEHOLDER}
            </Text>
            <Text c='dimmed' className={styles.percent} size='xs'>
              {item.percent}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AnalyticsRankList;
