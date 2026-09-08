import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountIcon from '@/modules/budget/components/AccountIcon/AccountIcon.tsx';
import AccountIconPicker from '@/modules/budget/components/AccountIconPicker/AccountIconPicker.tsx';
import {
  ACCOUNT_ICONS,
  type AccountIconName,
} from '@/modules/budget/components/accountIcons.ts';
import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from '@/modules/budget/constants.ts';
import styles from './AddAccountButton.module.css';

const AddAccountButton = () => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [iconName, setIconName] =
    useState<AccountIconName>(DEFAULT_ACCOUNT_ICON);

  return (
    <>
      <button
        type='button'
        className={styles.button}
        aria-haspopup='dialog'
        aria-expanded={opened}
        onClick={open}
      >
        <span className={styles.label}>{t('budget.addAccount')}</span>
        <AccountIcon
          icon={ACCOUNT_ICONS[iconName]}
          color={DEFAULT_ACCOUNT_COLOR}
        />
      </button>

      <AccountIconPicker
        opened={opened}
        onClose={close}
        value={iconName}
        onChange={setIconName}
      />
    </>

    // <button type='button' className={styles.button}>
    //   <span className={styles.label}>{t('budget.addAccount')}</span>
    //
    //   <span className={styles.badge}>
    //       <PlusIcon size={ACCOUNT_ICON_SIZE} aria-hidden />
    //     </span>
    // </button>
  );
};

export default AddAccountButton;
