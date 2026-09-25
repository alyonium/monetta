import { useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  stackId: string;
  opened: boolean;
  onClose: () => void;
  message: string;
  confirmLabel: string;
  errorMessage: string;
  invalidateKeys: readonly QueryKey[];
  onConfirm: () => Promise<{ ok: boolean }>;
  onSuccess: () => void;
};

const ConfirmModal = ({
  stackId,
  opened,
  onClose,
  message,
  confirmLabel,
  errorMessage,
  invalidateKeys,
  onConfirm,
  onSuccess,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onConfirm();

      if (!result.ok) {
        setError(errorMessage);
        return;
      }

      await Promise.all(
        invalidateKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      stackId={stackId}
      opened={opened}
      onClose={handleClose}
      centered
    >
      <div className={styles.body}>
        <Text>{message}</Text>

        <Group justify='flex-end'>
          <Button type='button' variant='default' onClick={handleClose}>
            {t('budget.createAccount.cancel')}
          </Button>

          <Button
            type='button'
            color='red'
            loading={isSubmitting}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </Group>

        {error && (
          <Text c='red' size='sm'>
            {error}
          </Text>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
