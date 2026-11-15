import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import EditTransactionModal from '@/components/EditTransactionModal/EditTransactionModal.tsx';
import AccountBlock from '@/modules/budget/components/AccountBlock/AccountBlock.tsx';
import AccountDetailsModal from '@/modules/budget/components/AccountDetailsModal/AccountDetailsModal.tsx';
import AccountItem from '@/modules/budget/components/AccountItem/AccountItem.tsx';
import CreateAccountModal from '@/modules/budget/components/CreateAccountModal/CreateAccountModal.tsx';
import EditAccountModal from '@/modules/budget/components/EditAccountModal/EditAccountModal.tsx';
import ParametersBar from '@/modules/budget/components/ParametersBar/ParametersBar.tsx';
import RecordTransactionModal from '@/modules/budget/components/RecordTransactionModal/RecordTransactionModal.tsx';
import RecordTransferModal from '@/modules/budget/components/RecordTransferModal/RecordTransferModal.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import { useAccountDnd } from '@/modules/budget/hooks/useAccountDnd.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import { useBudgetModals } from '@/modules/budget/hooks/useBudgetModals.ts';
import { useBudgetMonthTotals } from '@/modules/budget/hooks/useBudgetMonthTotals.ts';
import styles from './Budget.module.css';

const Budget = () => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(todayIso()));
  const [editing, setEditing] = useState(false);
  const { data, isError } = useBudgetAccounts(month);
  const totals = useBudgetMonthTotals(month, data?.[ACCOUNT_TYPE.CURRENT]);
  const {
    createModal,
    detailsModal,
    editModal,
    editTransaction,
    recordModal,
    detailsAccount,
    createType,
    transactionDrop,
    transferDrop,
    recordAccounts,
    showDetailsStack,
    onCloseDetails,
    onEditAccount,
  } = useBudgetModals(data);
  const {
    sensors,
    collisionDetection,
    activeAccount,
    overAccount,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  } = useAccountDnd({
    editing,
    month,
    accounts: data,
    onDrop: recordModal.open,
  });

  const details = (
    <AccountDetailsModal
      opened={detailsModal.session.opened}
      onClose={onCloseDetails}
      onExitTransitionEnd={detailsModal.dispose}
      account={detailsAccount}
      onEdit={onEditAccount}
      onTransactionClick={editTransaction.open}
    />
  );

  return (
    <div className={styles.page}>
      <ParametersBar
        month={month}
        onMonthChange={setMonth}
        totals={totals}
        editing={editing}
        onEditToggle={() => setEditing((current) => !current)}
      />

      {data ? (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          autoScroll={false}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          {Object.values(ACCOUNT_TYPE).map((type) => (
            <AccountBlock
              key={type}
              type={type}
              accounts={data[type]}
              editing={editing}
              overAccount={overAccount}
              onAddAccount={() => createModal.open(type)}
              onSelectAccount={detailsModal.open}
            />
          ))}

          <DragOverlay>
            {activeAccount && <AccountItem account={activeAccount} overlay />}
          </DragOverlay>
        </DndContext>
      ) : (
        <p className={styles.status}>
          {isError ? t('budget.errors.loadFailed') : t('budget.loading')}
        </p>
      )}

      <CreateAccountModal
        key={createModal.session.id}
        opened={createModal.session.opened}
        onClose={createModal.close}
        onExitTransitionEnd={createModal.dispose}
        accountType={createType}
        orderedIds={data?.[createType].map((account) => account.id) ?? []}
        month={month}
      />

      {showDetailsStack ? (
        <Modal.Stack>
          {details}

          {editModal.session.payload && (
            <EditAccountModal
              key={editModal.session.id}
              opened={editModal.session.opened}
              onClose={editModal.close}
              onExitTransitionEnd={editModal.dispose}
              account={editModal.session.payload}
            />
          )}

          {editTransaction.session.payload && (
            <EditTransactionModal
              key={editTransaction.session.id}
              stackId='edit-transaction'
              opened={editTransaction.session.opened}
              onClose={editTransaction.close}
              onExitTransitionEnd={editTransaction.dispose}
              transaction={editTransaction.session.payload}
              accounts={recordAccounts}
            />
          )}
        </Modal.Stack>
      ) : (
        details
      )}

      {transactionDrop && (
        <RecordTransactionModal
          key={recordModal.session.id}
          opened={recordModal.session.opened}
          onClose={recordModal.close}
          onExitTransitionEnd={recordModal.dispose}
          drop={transactionDrop}
          accounts={recordAccounts}
          month={month}
        />
      )}

      {transferDrop && (
        <RecordTransferModal
          key={recordModal.session.id}
          opened={recordModal.session.opened}
          onClose={recordModal.close}
          onExitTransitionEnd={recordModal.dispose}
          drop={transferDrop}
          accounts={recordAccounts[ACCOUNT_TYPE.CURRENT]}
          month={month}
        />
      )}
    </div>
  );
};

export default Budget;
