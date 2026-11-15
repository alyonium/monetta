import { ACCOUNT_TYPE } from '@/modules/budget/constants/account.ts';
import { hasDetailsStack } from '@/modules/budget/helpers/account/hasDetailsStack.ts';
import { liveBudgetAccount } from '@/modules/budget/helpers/account/liveBudgetAccount.ts';
import { EditableAccountTransaction } from '@/modules/budget/helpers/transactions/isEditableAccountTransaction.ts';
import {
  toRecordTransactionDrop,
  toRecordTransferDrop,
} from '@/modules/budget/helpers/transactions/recordTransactionKind.ts';
import { RecordDrop } from '@/modules/budget/helpers/transactions/resolveRecordDrop.ts';
import { toRecordAccounts } from '@/modules/budget/helpers/transactions/toRecordAccounts.ts';
import { useModalSession } from '@/modules/budget/hooks/useModalSession.ts';
import {
  AccountType,
  BudgetAccount,
  BudgetAccountsByBlock,
} from '@/modules/budget/types/budgetAccount.ts';

export const useBudgetModals = (
  accounts: BudgetAccountsByBlock | undefined,
) => {
  const createModal = useModalSession<AccountType>();
  const detailsModal = useModalSession<BudgetAccount>();
  const editModal = useModalSession<BudgetAccount>();
  const editTransaction = useModalSession<EditableAccountTransaction>();
  const recordModal = useModalSession<RecordDrop>();
  const detailsAccount = liveBudgetAccount(
    accounts,
    detailsModal.session.payload,
  );
  const createType = createModal.session.payload ?? ACCOUNT_TYPE.INCOME;

  const onCloseDetails = () => {
    detailsModal.close();
    editModal.dispose();
    editTransaction.dispose();
  };

  const onEditAccount = () => {
    if (detailsAccount) {
      editModal.open(detailsAccount);
    }
  };

  return {
    createModal,
    detailsModal,
    editModal,
    editTransaction,
    recordModal,
    detailsAccount,
    createType,
    transactionDrop: toRecordTransactionDrop(recordModal.session.payload),
    transferDrop: toRecordTransferDrop(recordModal.session.payload),
    recordAccounts: toRecordAccounts(accounts),
    showDetailsStack: hasDetailsStack(
      detailsModal.session.opened,
      editModal.session.payload,
      editTransaction.session.payload,
    ),
    onCloseDetails,
    onEditAccount,
  };
};
