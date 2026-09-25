import {
  defaultTransactionDate,
  todayIso,
} from '@/modules/budget/helpers/month/budgetMonth.ts';
import type { RecordIncomeFormValues } from '@/modules/budget/types/recordIncomeForm.ts';

export const initialRecordIncomeFormValues = (
  sourceId: string,
  destinationId: string,
  month: string,
): RecordIncomeFormValues => ({
  incomeAccountId: sourceId,
  currentAccountId: destinationId,
  amount: '',
  date: defaultTransactionDate({ month, today: todayIso() }),
  description: '',
  tags: [],
});
