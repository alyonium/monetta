import { useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BUDGET_ACCOUNTS_QUERY_KEY } from '@/modules/budget/constants/queries.ts';
import { hideBudgetAccount } from '@/modules/budget/helpers/account/hideBudgetAccount.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import styles from './AccountHideConfirmModal.module.css';

type AccountHideConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  account: BudgetAccount;
  onSuccess: () => void;
};

const AccountHideConfirmModal = ({
  opened,
  onClose,
  account,
  onSuccess,
}: AccountHideConfirmModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideError, setHideError] = useState<string | null>(null);

  const handleClose = () => {
    setHideError(null);
    onClose();
  };

  const handleHide = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setHideError(null);

    try {
      const result = await hideBudgetAccount(account.id, account.name);

      if (!result.ok) {
        setHideError(t('budget.accountDetails.hideFailed'));
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: BUDGET_ACCOUNTS_QUERY_KEY,
      });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      stackId='account-hide-confirm'
      opened={opened}
      onClose={handleClose}
      centered
    >
      <div className={styles.body}>
        <Text>
          {t('budget.accountDetails.hideConfirm', { name: account.name })}
        </Text>

        <Group justify='flex-end'>
          <Button type='button' variant='default' onClick={handleClose}>
            {t('budget.createAccount.cancel')}
          </Button>

          <Button
            type='button'
            variant='default'
            loading={isSubmitting}
            onClick={handleHide}
          >
            {t('budget.accountDetails.hide')}
          </Button>
        </Group>

        {hideError && (
          <Text c='red' size='sm'>
            {hideError}
          </Text>
        )}
      </div>
    </Modal>
  );
};

export default AccountHideConfirmModal;
