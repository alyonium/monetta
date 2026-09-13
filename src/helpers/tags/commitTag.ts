export const commitTag = (
  query: string,
  selected: string[],
  catalog: string[],
): string[] => {
  const trimmed = query.trim();

  if (!trimmed) {
    return selected;
  }

  const key = trimmed.toLowerCase();

  if (selected.some((tag) => tag.toLowerCase() === key)) {
    return selected;
  }

  const canonical = catalog.find((tag) => tag.toLowerCase() === key);

  return [...selected, canonical ?? trimmed];
};
