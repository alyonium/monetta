import dayjs from 'dayjs';

const GROUP_LABEL = 'D MMM YYYY';
const ISO_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

export const accountTransactionDate = (iso: string): string | null => {
  const match = iso.match(ISO_DATE_PREFIX);

  return match?.[1] ?? null;
};

export const formatAccountTransactionGroupDate = (date: string): string =>
  dayjs(date).format(GROUP_LABEL);
