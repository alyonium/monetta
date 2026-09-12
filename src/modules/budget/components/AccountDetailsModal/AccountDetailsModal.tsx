import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountDeleteConfirmModal from '@/modules/budget/components/AccountDeleteConfirmModal/AccountDeleteConfirmModal.tsx';
import AccountDetailsBody from '@/modules/budget/components/AccountDetailsModal/AccountDetailsBody/AccountDetailsBody.tsx';
import AccountHideConfirmModal from '@/modules/budget/components/AccountHideConfirmModal/AccountHideConfirmModal.tsx';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

type AccountDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
  account: BudgetAccount | null;
  onEdit: () => void;
};

const AccountDetailsModal = ({
  opened,
  onClose,
  account,
  onEdit,
}: AccountDetailsModalProps) => {
  const { t } = useTranslation();
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [hideOpened, { open: openHide, close: closeHide }] =
    useDisclosure(false);

  const handleClose = () => {
    closeDelete();
    closeHide();
    onClose();
  };

  return (
    <>
      <Modal
        stackId='account-details'
        opened={opened}
        onClose={handleClose}
        title={account?.name ?? ''}
        centered
        closeButtonProps={{ 'aria-label': t('budget.accountDetails.close') }}
      >
        {account && (
          <AccountDetailsBody
            key={account.id}
            account={account}
            opened={opened}
            onEdit={onEdit}
            onDelete={openDelete}
            onHide={openHide}
          />
        )}
      </Modal>

      {account && (
        <>
          <AccountDeleteConfirmModal
            opened={opened && deleteOpened}
            onClose={closeDelete}
            account={account}
            onSuccess={handleClose}
          />
          <AccountHideConfirmModal
            opened={opened && hideOpened}
            onClose={closeHide}
            account={account}
            onSuccess={handleClose}
          />
        </>
      )}
    </>
  );
};

export default AccountDetailsModal;
