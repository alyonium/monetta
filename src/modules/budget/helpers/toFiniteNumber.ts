export const toFiniteNumber = (
  value: string | null | undefined,
): number | null => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};
