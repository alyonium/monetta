import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import AccountDetailsBody from '@/modules/budget/components/AccountDetailsModal/AccountDetailsBody/AccountDetailsBody.tsx';
import ConfirmModal from '@/modules/budget/components/ConfirmModal/ConfirmModal.tsx';
import {
  BUDGET_ACCOUNTS_QUERY_KEY,
  BUDGET_INSIGHTS_QUERY_KEY,
} from '@/modules/budget/constants/queries.ts';
import { deleteBudgetAccount } from '@/modules/budget/helpers/account/deleteBudgetAccount.ts';
import { hideBudgetAccount } from '@/modules/budget/helpers/account/hideBudgetAccount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';

type AccountDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
  onExitTransitionEnd: () => void;
  account: BudgetAccount | null;
  onEdit: () => void;
};

const AccountDetailsModal = ({
  opened,
  onClose,
  onExitTransitionEnd,
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
        onExitTransitionEnd={onExitTransitionEnd}
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
          <ConfirmModal
            stackId='account-delete-confirm'
            opened={opened && deleteOpened}
            onClose={closeDelete}
            message={t('budget.accountDetails.deleteConfirm', {
              name: account.name,
            })}
            confirmLabel={t('budget.accountDetails.delete')}
            errorMessage={t('budget.accountDetails.deleteFailed')}
            invalidateKeys={[
              BUDGET_ACCOUNTS_QUERY_KEY,
              BUDGET_INSIGHTS_QUERY_KEY,
            ]}
            onConfirm={() => deleteBudgetAccount(account.id)}
            onSuccess={handleClose}
          />
          <ConfirmModal
            stackId='account-hide-confirm'
            opened={opened && hideOpened}
            onClose={closeHide}
            message={t('budget.accountDetails.hideConfirm', {
              name: account.name,
            })}
            confirmLabel={t('budget.accountDetails.hide')}
            errorMessage={t('budget.accountDetails.hideFailed')}
            invalidateKeys={[BUDGET_ACCOUNTS_QUERY_KEY]}
            onConfirm={() => hideBudgetAccount(account.id, account.name)}
            onSuccess={handleClose}
          />
        </>
      )}
    </>
  );
};

export default AccountDetailsModal;
