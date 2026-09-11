import {
  type CSSProperties,
  type ReactNode,
  type SubmitEventHandler,
} from 'react';
import { Group, Text, TextInput, type TextInputProps } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountColorPicker from '@/modules/budget/components/AccountColorPicker/AccountColorPicker.tsx';
import { accountIconGlyphColor } from '@/modules/budget/helpers/appearance/accountIconContrast.ts';
import styles from './AccountFormLayout.module.css';

type AccountFormLayoutProps = {
  color: string;
  onColorChange: (color: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  beforeFields?: ReactNode;
  iconButton: ReactNode;
  nameInputProps: Pick<
    TextInputProps,
    'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur' | 'error'
  >;
  extraFields?: ReactNode;
  error: string | null;
  actions: ReactNode;
};

const AccountFormLayout = ({
  color,
  onColorChange,
  onSubmit,
  beforeFields,
  iconButton,
  nameInputProps,
  extraFields,
  error,
  actions,
}: AccountFormLayoutProps) => {
  const { t } = useTranslation();
  const ink = accountIconGlyphColor(color);
  const fieldClassNames = { label: styles.fieldLabel };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {beforeFields}

      <div
        className={styles.fields}
        style={
          {
            '--account-form-color': color,
            '--account-form-ink': ink,
          } as CSSProperties
        }
      >
        <div className={styles.nameRow}>
          {iconButton}

          <TextInput
            className={styles.nameField}
            label={t('budget.createAccount.name')}
            classNames={fieldClassNames}
            {...nameInputProps}
          />
        </div>

        {extraFields}
      </div>

      <AccountColorPicker value={color} onChange={onColorChange} />

      {error && (
        <Text c='red' size='sm'>
          {error}
        </Text>
      )}

      <Group className={styles.actions} justify='flex-end'>
        {actions}
      </Group>
    </form>
  );
};

export default AccountFormLayout;
