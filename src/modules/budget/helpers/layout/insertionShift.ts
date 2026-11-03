export const cellPosition = (
  index: number,
  columns: number,
  outside: 'previous' | 'next' | null = null,
): { column: number; row: number } | null => {
  if (columns < 1 || index < 0) {
    return null;
  }

  const column =
    (index % columns) +
    (outside === 'next' ? 1 : outside === 'previous' ? -1 : 0);

  return {
    column,
    row: Math.floor(index / columns),
  };
};
