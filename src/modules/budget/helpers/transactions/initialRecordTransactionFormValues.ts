import {
  defaultTransactionDate,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { RecordTransactionFormValues } from '@/modules/budget/types/recordTransactionForm.ts';

export const initialRecordTransactionFormValues = (
  sourceId: string,
  destinationId: string,
  month: string,
): RecordTransactionFormValues => ({
  sourceAccountId: sourceId,
  destinationAccountId: destinationId,
  amount: '',
  date: defaultTransactionDate({ month, today: todayIso() }),
  description: '',
  tags: [],
});
