import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AccountBlock from '@/modules/budget/components/AccountBlock/AccountBlock.tsx';
import AccountDetailsModal from '@/modules/budget/components/AccountDetailsModal/AccountDetailsModal.tsx';
import AccountItem from '@/modules/budget/components/AccountItem/AccountItem.tsx';
import CreateAccountModal from '@/modules/budget/components/CreateAccountModal/CreateAccountModal.tsx';
import EditAccountModal from '@/modules/budget/components/EditAccountModal/EditAccountModal.tsx';
import ParametersBar from '@/modules/budget/components/ParametersBar/ParametersBar.tsx';
import RecordIncomeModal from '@/modules/budget/components/RecordIncomeModal/RecordIncomeModal.tsx';
import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { RECORD_DROP_KIND } from '@/modules/budget/constants/accountDnd.ts';
import { liveBudgetAccount } from '@/modules/budget/helpers/account/liveBudgetAccount.ts';
import {
  startOfMonth,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import { useAccountDnd } from '@/modules/budget/hooks/useAccountDnd.ts';
import { useBudgetAccounts } from '@/modules/budget/hooks/useBudgetAccounts.ts';
import { useBudgetMonthTotals } from '@/modules/budget/hooks/useBudgetMonthTotals.ts';
import { useModalSession } from '@/modules/budget/hooks/useModalSession.ts';
import type {
  AccountType,
  BudgetAccount,
} from '@/modules/budget/types/budgetAccount.ts';
import styles from './Budget.module.css';

const Budget = () => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(todayIso()));
  const createModal = useModalSession<AccountType>();
  const detailsModal = useModalSession<BudgetAccount>();
  const editModal = useModalSession<BudgetAccount>();
  const recordIncomeModal = useModalSession<{
    source: BudgetAccount;
    destination: BudgetAccount;
  }>();

  const { data, isError } = useBudgetAccounts(month);
  const totals = useBudgetMonthTotals(month, data?.[ACCOUNT_TYPE.CURRENT]);
  const { sensors, activeAccount, onDragStart, onDragEnd, onDragCancel } =
    useAccountDnd((drop) => {
      switch (drop.kind) {
        case RECORD_DROP_KIND.INCOME:
          recordIncomeModal.open({
            source: drop.source,
            destination: drop.destination,
          });
          return;
        case RECORD_DROP_KIND.EXPENSE:
        case RECORD_DROP_KIND.TRANSFER:
          return;
        default: {
          const unexpectedKind: never = drop.kind;
          void unexpectedKind;
        }
      }
    });
  const detailsAccount = liveBudgetAccount(data, detailsModal.session.payload);
  const createType = createModal.session.payload ?? ACCOUNT_TYPE.INCOME;

  const onCloseDetails = () => {
    detailsModal.close();
    editModal.dispose();
  };

  const onEditAccount = () => {
    if (detailsAccount) {
      editModal.open(detailsAccount);
    }
  };

  return (
    <div className={styles.page}>
      <ParametersBar month={month} onMonthChange={setMonth} totals={totals} />

      {data ? (
        <DndContext
          sensors={sensors}
          autoScroll={false}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          {Object.values(ACCOUNT_TYPE).map((type) => (
            <AccountBlock
              key={type}
              type={type}
              accounts={data[type]}
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

      {detailsModal.session.opened || editModal.session.payload ? (
        <Modal.Stack>
          <AccountDetailsModal
            opened={detailsModal.session.opened}
            onClose={onCloseDetails}
            onExitTransitionEnd={detailsModal.dispose}
            account={detailsAccount}
            onEdit={onEditAccount}
          />

          {editModal.session.payload && (
            <EditAccountModal
              key={editModal.session.id}
              opened={editModal.session.opened}
              onClose={editModal.close}
              onExitTransitionEnd={editModal.dispose}
              account={editModal.session.payload}
            />
          )}
        </Modal.Stack>
      ) : (
        <AccountDetailsModal
          opened={detailsModal.session.opened}
          onClose={onCloseDetails}
          onExitTransitionEnd={detailsModal.dispose}
          account={detailsAccount}
          onEdit={onEditAccount}
        />
      )}

      {recordIncomeModal.session.payload && (
        <RecordIncomeModal
          key={recordIncomeModal.session.id}
          opened={recordIncomeModal.session.opened}
          onClose={recordIncomeModal.close}
          onExitTransitionEnd={recordIncomeModal.dispose}
          source={recordIncomeModal.session.payload.source}
          destination={recordIncomeModal.session.payload.destination}
          incomeAccounts={data?.[ACCOUNT_TYPE.INCOME] ?? []}
          currentAccounts={data?.[ACCOUNT_TYPE.CURRENT] ?? []}
          month={month}
        />
      )}
    </div>
  );
};

export default Budget;
