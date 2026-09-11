import type { ValidationErrorResponse } from '@/api/types.gen.ts';

export const hasNameError = (
  error: ValidationErrorResponse | undefined,
): boolean => {
  const names = error?.errors?.name;

  return Array.isArray(names) && names.length > 0;
};
