import {
  defaultTransactionDate,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { RecordTransferFormValues } from '@/modules/budget/types/recordTransferForm.ts';

export const initialRecordTransferFormValues = (
  sourceId: string,
  destinationId: string,
  month: string,
): RecordTransferFormValues => ({
  sourceAccountId: sourceId,
  destinationAccountId: destinationId,
  amount: '',
  foreignAmount: '',
  date: defaultTransactionDate({ month, today: todayIso() }),
  description: '',
  tags: [],
});
