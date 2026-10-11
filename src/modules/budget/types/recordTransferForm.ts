export type RecordTransferFormValues = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number | string;
  foreignAmount: number | string;
  date: string;
  description: string;
  tags: string[];
};

export type RecordTransferFormFieldErrors = {
  sourceAccountId?: 'budget.recordTransaction.errors.accountRequired';
  destinationAccountId?:
    | 'budget.recordTransaction.errors.accountRequired'
    | 'budget.recordTransfer.errors.sameAccount';
  amount?: 'budget.recordTransaction.errors.amountRequired';
  foreignAmount?: 'budget.recordTransaction.errors.amountRequired';
  date?: 'budget.recordTransaction.errors.dateRequired';
};
