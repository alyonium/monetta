import { PlusIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants.ts';
import styles from './AddAccountButton.module.css';

const AddAccountButton = () => {
  const { t } = useTranslation();

  return (
    <button type='button' className={styles.button}>
      <span className={styles.label}>{t('budget.addAccount')}</span>

      <span className={styles.badge}>
        <PlusIcon size={ACCOUNT_ICON_SIZE} aria-hidden />
      </span>
    </button>
  );
};

export default AddAccountButton;
