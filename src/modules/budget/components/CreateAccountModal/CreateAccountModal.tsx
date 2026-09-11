import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountFormLayout from '@/modules/budget/components/AccountFormLayout/AccountFormLayout.tsx';
import AccountIconButton from '@/modules/budget/components/AccountIconButton/AccountIconButton.tsx';
import AccountIconPicker from '@/modules/budget/components/AccountIconPicker/AccountIconPicker.tsx';
import AccountMoneyFields from '@/modules/budget/components/AccountMoneyFields/AccountMoneyFields.tsx';
import ExpenseKindControl from '@/modules/budget/components/ExpenseKindControl/ExpenseKindControl.tsx';
import { CREATE_ACCOUNT_TITLE_KEY } from '@/modules/budget/constants/account.ts';
import { useCreateAccountForm } from '@/modules/budget/hooks/useCreateAccountForm.ts';
import type { AccountType } from '@/modules/budget/types/budgetAccount.ts';

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

  return (
    <Modal.Stack>
      <Modal
        stackId='create-account'
        opened={opened}
        onClose={onClose}
        title={t(CREATE_ACCOUNT_TITLE_KEY[accountType])}
        centered
      >
        <AccountFormLayout
          color={form.values.color}
          onColorChange={(color) => form.setFieldValue('color', color)}
          onSubmit={handleSubmit}
          beforeFields={
            showKind && (
              <ExpenseKindControl
                isDebt={form.values.isDebt}
                onChange={(isDebt) => form.setFieldValue('isDebt', isDebt)}
              />
            )
          }
          iconButton={
            <AccountIconButton
              icon={form.values.icon}
              color={form.values.color}
              expanded={pickerOpened}
              onClick={openPicker}
            />
          }
          nameInputProps={form.getInputProps('name')}
          extraFields={
            showMoney && (
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
            )
          }
          error={saveError}
          actions={
            <>
              <Button type='button' variant='default' onClick={onClose}>
                {t('budget.createAccount.cancel')}
              </Button>
              <Button type='submit' loading={isSubmitting}>
                {t('budget.createAccount.save')}
              </Button>
            </>
          }
        />
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
