export const isValidTransactionAmount = (amount: number | string): boolean => {
  const parsed = Number(amount);

  return Number.isFinite(parsed) && parsed > 0;
};
