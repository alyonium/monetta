import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  ACCOUNT_ICONS,
  type AccountIconName,
} from '@/modules/budget/components/accountIcons.ts';
import IconCell from './IconCell/IconCell.tsx';
import styles from './AccountIconPicker.module.css';

type AccountIconPickerProps = {
  opened: boolean;
  onClose: () => void;
  value: AccountIconName;
  onChange: (name: AccountIconName) => void;
};

const AccountIconPicker = ({
  opened,
  onClose,
  value,
  onChange,
}: AccountIconPickerProps) => {
  const { t } = useTranslation();

  const onPick = (name: AccountIconName) => {
    onChange(name);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('budget.iconPicker.title')}
      centered
      classNames={{ content: styles.content, body: styles.body }}
    >
      <div className={styles.scroller}>
        <div className={styles.grid}>
          {(Object.keys(ACCOUNT_ICONS) as AccountIconName[]).map((name) => (
            <IconCell
              key={name}
              name={name}
              icon={ACCOUNT_ICONS[name]}
              selected={name === value}
              onPick={onPick}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AccountIconPicker;
