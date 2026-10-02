const BLANK_TRANSACTION_DESCRIPTION = '\u2066';

export const transactionDescription = (description: string): string =>
  description.trim() === '' ? BLANK_TRANSACTION_DESCRIPTION : description;

export const hasTransactionDescription = (description: string): boolean =>
  description.replaceAll(BLANK_TRANSACTION_DESCRIPTION, '').trim() !== '';
