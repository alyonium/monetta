import { useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  BUDGET_ACCOUNTS_QUERY_KEY,
  BUDGET_INSIGHTS_QUERY_KEY,
} from '@/modules/budget/constants/queries.ts';
import { deleteBudgetAccount } from '@/modules/budget/helpers/account/deleteBudgetAccount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountDeleteConfirmModal.module.css';

type AccountDeleteConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  account: BudgetAccount;
  onSuccess: () => void;
};

const AccountDeleteConfirmModal = ({
  opened,
  onClose,
  account,
  onSuccess,
}: AccountDeleteConfirmModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleClose = () => {
    setDeleteError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setDeleteError(null);

    try {
      const result = await deleteBudgetAccount(account.id);

      if (!result.ok) {
        setDeleteError(t('budget.accountDetails.deleteFailed'));
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: BUDGET_ACCOUNTS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: BUDGET_INSIGHTS_QUERY_KEY,
        }),
      ]);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      stackId='account-delete-confirm'
      opened={opened}
      onClose={handleClose}
      centered
    >
      <div className={styles.body}>
        <Text>
          {t('budget.accountDetails.deleteConfirm', { name: account.name })}
        </Text>

        <Group justify='flex-end'>
          <Button type='button' variant='default' onClick={handleClose}>
            {t('budget.createAccount.cancel')}
          </Button>

          <Button
            type='button'
            color='red'
            loading={isSubmitting}
            onClick={handleDelete}
          >
            {t('budget.accountDetails.delete')}
          </Button>
        </Group>

        {deleteError && (
          <Text c='red' size='sm'>
            {deleteError}
          </Text>
        )}
      </div>
    </Modal>
  );
};

export default AccountDeleteConfirmModal;
