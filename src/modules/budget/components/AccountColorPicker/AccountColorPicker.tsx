import { ColorPicker, Input } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_COLORS } from '@/modules/budget/constants/appearance.ts';
import styles from './AccountColorPicker.module.css';

const SWATCHES_PER_ROW = 7;

type AccountColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

const AccountColorPicker = ({ value, onChange }: AccountColorPickerProps) => {
  const { t } = useTranslation();

  return (
    <Input.Wrapper label={t('budget.createAccount.color')}>
      <ColorPicker
        format='hex'
        withPicker={false}
        fullWidth
        swatches={[...ACCOUNT_COLORS]}
        swatchesPerRow={SWATCHES_PER_ROW}
        value={value}
        onChange={onChange}
        classNames={{ swatch: styles.swatch }}
      />
    </Input.Wrapper>
  );
};

export default AccountColorPicker;
