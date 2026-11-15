export const toFiniteNumber = (
  value: string | null | undefined,
): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};
