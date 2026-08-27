export const normalizeBackendUrl = (url: string): string => {
  const trimmed = url.trim();
  const absolute = trimmed.includes('://') ? trimmed : `https://${trimmed}`;

  return `${new URL(absolute).origin}/api`;
};
