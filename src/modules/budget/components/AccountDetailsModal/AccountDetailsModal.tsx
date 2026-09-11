import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountDetailsBody from '@/modules/budget/components/AccountDetailsModal/AccountDetailsBody/AccountDetailsBody.tsx';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

type AccountDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
  account: BudgetAccount | null;
};

const AccountDetailsModal = ({
  opened,
  onClose,
  account,
}: AccountDetailsModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={account?.name ?? ''}
      centered
      closeButtonProps={{ 'aria-label': t('budget.accountDetails.close') }}
    >
      {account && (
        <AccountDetailsBody
          key={account.id}
          account={account}
          opened={opened}
        />
      )}
    </Modal>
  );
};

export default AccountDetailsModal;
