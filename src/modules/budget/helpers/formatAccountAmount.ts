export const formatAccountAmount = (
  amount: number,
  currencySymbol: string,
  currencyCode: string,
): string => {
  const currency = currencySymbol || currencyCode;

  return currency ? `${amount} ${currency}` : `${amount}`;
};
