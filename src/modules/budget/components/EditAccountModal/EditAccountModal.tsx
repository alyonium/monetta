import { Button, Modal, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountFormLayout from '@/modules/budget/components/AccountFormLayout/AccountFormLayout.tsx';
import AccountIconButton from '@/modules/budget/components/AccountIconButton/AccountIconButton.tsx';
import AccountIconPicker from '@/modules/budget/components/AccountIconPicker/AccountIconPicker.tsx';
import { EDIT_ACCOUNT_TITLE_KEY } from '@/modules/budget/constants.ts';
import { useEditAccountForm } from '@/modules/budget/hooks/useEditAccountForm.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

type EditAccountModalProps = {
  opened: boolean;
  onClose: () => void;
  account: BudgetAccount;
};

const EditAccountModal = ({
  opened,
  onClose,
  account,
}: EditAccountModalProps) => {
  const { t } = useTranslation();
  const [pickerOpened, { open: openPicker, close: closePicker }] =
    useDisclosure(false);
  const {
    form,
    showBalance,
    isSubmitting,
    saveError,
    handleDiscard,
    handleSubmit,
  } = useEditAccountForm({
    onClose,
    account,
  });

  return (
    <>
      <Modal
        stackId='edit-account'
        opened={opened}
        onClose={onClose}
        title={t(EDIT_ACCOUNT_TITLE_KEY[account.type])}
        centered
      >
        <AccountFormLayout
          color={form.values.color}
          onColorChange={(color) => form.setFieldValue('color', color)}
          onSubmit={handleSubmit}
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
            showBalance && (
              <NumberInput
                label={t('budget.accountDetails.balance')}
                hideControls
                value={form.values.balance}
                onChange={(value) =>
                  form.setFieldValue(
                    'balance',
                    typeof value === 'number' ? value : 0,
                  )
                }
              />
            )
          }
          error={saveError}
          actions={
            <>
              <Button type='button' variant='default' onClick={handleDiscard}>
                {t('budget.editAccount.discard')}
              </Button>
              <Button type='submit' loading={isSubmitting}>
                {t('budget.createAccount.save')}
              </Button>
            </>
          }
        />
      </Modal>

      <AccountIconPicker
        stackId='edit-account-icon-picker'
        opened={opened && pickerOpened}
        onClose={closePicker}
        value={form.values.icon}
        onChange={(name) => form.setFieldValue('icon', name)}
        color={form.values.color}
      />
    </>
  );
};

export default EditAccountModal;
