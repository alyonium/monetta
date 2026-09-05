import { Button, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from './ParametersBar.module.css';

const AMOUNT_PLACEHOLDER = '—';

const ParametersBar = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.bar}>
      <div className={styles.metrics}>
        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.income')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>

        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.expenses')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>

        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.balance')}
          </Text>
          <Text>{AMOUNT_PLACEHOLDER}</Text>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.slot}>
          <Text size='xs' c='dimmed'>
            {t('budget.parameters.month')}
          </Text>
        </div>

        <Button type='button' variant='default' size='sm'>
          {t('budget.parameters.edit')}
        </Button>
      </div>
    </header>
  );
};

export default ParametersBar;
