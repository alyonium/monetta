import { type CSSProperties } from 'react';
import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountColorPicker from '@/modules/budget/components/AccountColorPicker/AccountColorPicker.tsx';
import AccountIconButton from '@/modules/budget/components/AccountIconButton/AccountIconButton.tsx';
import AccountIconPicker from '@/modules/budget/components/AccountIconPicker/AccountIconPicker.tsx';
import AccountMoneyFields from '@/modules/budget/components/AccountMoneyFields/AccountMoneyFields.tsx';
import ExpenseKindControl from '@/modules/budget/components/ExpenseKindControl/ExpenseKindControl.tsx';
import { CREATE_ACCOUNT_TITLE_KEY } from '@/modules/budget/constants.ts';
import { accountIconGlyphColor } from '@/modules/budget/helpers/accountIconContrast.ts';
import { useCreateAccountForm } from '@/modules/budget/hooks/useCreateAccountForm.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';
import styles from './CreateAccountModal.module.css';

type CreateAccountModalProps = {
  opened: boolean;
  onClose: () => void;
  accountType: AccountType;
  orderedIds: string[];
  month: string;
};

const CreateAccountModal = ({
  opened,
  onClose,
  accountType,
  orderedIds,
  month,
}: CreateAccountModalProps) => {
  const { t } = useTranslation();
  const [pickerOpened, { open: openPicker, close: closePicker }] =
    useDisclosure(false);
  const {
    form,
    showKind,
    showMoney,
    currencies,
    isSubmitting,
    saveError,
    handleSubmit,
  } = useCreateAccountForm({
    opened,
    onClose,
    accountType,
    orderedIds,
    month,
  });

  const ink = accountIconGlyphColor(form.values.color);
  const fieldClassNames = { label: styles.fieldLabel };

  return (
    <Modal.Stack>
      <Modal
        stackId='create-account'
        opened={opened}
        onClose={onClose}
        title={t(CREATE_ACCOUNT_TITLE_KEY[accountType])}
        centered
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          {showKind && (
            <ExpenseKindControl
              isDebt={form.values.isDebt}
              onChange={(isDebt) => form.setFieldValue('isDebt', isDebt)}
            />
          )}

          <div
            className={styles.fields}
            style={
              {
                '--create-account-color': form.values.color,
                '--create-account-ink': ink,
              } as CSSProperties
            }
          >
            <div className={styles.nameRow}>
              <AccountIconButton
                icon={form.values.icon}
                color={form.values.color}
                expanded={pickerOpened}
                onClick={openPicker}
              />

              <TextInput
                className={styles.nameField}
                label={t('budget.createAccount.name')}
                classNames={fieldClassNames}
                {...form.getInputProps('name')}
              />
            </div>

            {showMoney && (
              <AccountMoneyFields
                initialBalance={form.values.initialBalance}
                onInitialBalanceChange={(value) =>
                  form.setFieldValue('initialBalance', value)
                }
                currency={form.values.currency}
                onCurrencyChange={(value) =>
                  form.setFieldValue('currency', value)
                }
                currencyError={form.errors.currency}
                currencies={currencies}
              />
            )}
          </div>

          <AccountColorPicker
            value={form.values.color}
            onChange={(color) => form.setFieldValue('color', color)}
          />

          {saveError && (
            <Text c='red' size='sm'>
              {saveError}
            </Text>
          )}

          <Group className={styles.actions} justify='flex-end'>
            <Button type='button' variant='default' onClick={onClose}>
              {t('budget.createAccount.cancel')}
            </Button>
            <Button type='submit' loading={isSubmitting}>
              {t('budget.createAccount.save')}
            </Button>
          </Group>
        </form>
      </Modal>

      <AccountIconPicker
        stackId='account-icon-picker'
        opened={opened && pickerOpened}
        onClose={closePicker}
        value={form.values.icon}
        onChange={(name) => form.setFieldValue('icon', name)}
        color={form.values.color}
      />
    </Modal.Stack>
  );
};

export default CreateAccountModal;
