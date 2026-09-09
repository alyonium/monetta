import { useTranslation } from 'react-i18next';
import AccountIcon from '@/modules/budget/components/AccountIcon/AccountIcon.tsx';
import {
  ACCOUNT_ICONS,
  type AccountIconName,
} from '@/modules/budget/components/accountIcons.ts';
import styles from './AccountIconButton.module.css';

type AccountIconButtonProps = {
  icon: AccountIconName;
  color: string;
  expanded: boolean;
  onClick: () => void;
};

const AccountIconButton = ({
  icon,
  color,
  expanded,
  onClick,
}: AccountIconButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type='button'
      className={styles.button}
      aria-label={t('budget.iconPicker.open')}
      aria-haspopup='dialog'
      aria-expanded={expanded}
      onClick={onClick}
    >
      <AccountIcon icon={ACCOUNT_ICONS[icon]} color={color} />
    </button>
  );
};

export default AccountIconButton;
