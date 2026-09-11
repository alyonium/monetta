export const ACCOUNT_NAME_REQUIRED_ERROR =
  'budget.createAccount.errors.nameRequired' as const;

export const validateAccountName = (
  name: string,
): typeof ACCOUNT_NAME_REQUIRED_ERROR | undefined => {
  if (!name.trim()) {
    return ACCOUNT_NAME_REQUIRED_ERROR;
  }

  return undefined;
};
