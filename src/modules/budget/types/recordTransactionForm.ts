export type RecordTransactionFormValues = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number | string;
  date: string;
  description: string;
  tags: string[];
};

export type RecordTransactionFormFieldErrors = {
  sourceAccountId?: 'budget.recordTransaction.errors.accountRequired';
  destinationAccountId?: 'budget.recordTransaction.errors.accountRequired';
  amount?: 'budget.recordTransaction.errors.amountRequired';
  date?: 'budget.recordTransaction.errors.dateRequired';
};
