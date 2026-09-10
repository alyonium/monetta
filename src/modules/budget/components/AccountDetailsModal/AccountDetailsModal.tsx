import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountDetailsHeader from './AccountDetailsHeader/AccountDetailsHeader.tsx';
import styles from './AccountDetailsModal.module.css';

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
        <div className={styles.body}>
          <AccountDetailsHeader account={account} />

          <TextInput label={t('budget.accountDetails.search')} readOnly />

          <div className={styles.transactions}>
            <Text c='dimmed' size='sm'>
              {t('budget.accountDetails.transactionsPlaceholder')}
            </Text>
          </div>

          <Group justify='space-between'>
            <Button type='button' color='red' variant='light'>
              {t('budget.accountDetails.delete')}
            </Button>

            <Button type='button' variant='default'>
              {t('budget.accountDetails.hide')}
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
};

export default AccountDetailsModal;
