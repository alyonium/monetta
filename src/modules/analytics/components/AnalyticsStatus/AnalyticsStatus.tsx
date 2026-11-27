import { Loader, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

type AnalyticsStatusProps = {
  failed: boolean;
};

const AnalyticsStatus = ({ failed }: AnalyticsStatusProps) => {
  const { t } = useTranslation();

  if (failed) {
    return (
      <Text c='dimmed' size='sm'>
        {t('analytics.loadFailed')}
      </Text>
    );
  }

  return (
    <Loader aria-label={t('analytics.loading')} color='indigo.4' size='sm' />
  );
};

export default AnalyticsStatus;
