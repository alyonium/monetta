import dayjs from 'dayjs';

const ISO_DATE = 'YYYY-MM-DD';

const MONTH_RELATION = {
  PAST: 'past',
  CURRENT: 'current',
  FUTURE: 'future',
} as const;

type MonthToday = {
  month: string;
  today: string;
};

type MonthRelation = (typeof MONTH_RELATION)[keyof typeof MONTH_RELATION];

export const todayIso = (): string => dayjs().format(ISO_DATE);

export const startOfMonth = (isoDate: string): string =>
  dayjs(isoDate).startOf('month').format(ISO_DATE);

export const endOfMonth = (isoDate: string): string =>
  dayjs(isoDate).endOf('month').format(ISO_DATE);

const monthRelation = ({ month, today }: MonthToday): MonthRelation => {
  const monthStart = startOfMonth(month);
  const todayStart = startOfMonth(today);

  if (monthStart < todayStart) {
    return MONTH_RELATION.PAST;
  }

  if (monthStart > todayStart) {
    return MONTH_RELATION.FUTURE;
  }

  return MONTH_RELATION.CURRENT;
};

export const fireflyBalanceDate = ({ month, today }: MonthToday): string => {
  const relation = monthRelation({ month, today });

  switch (relation) {
    case MONTH_RELATION.PAST:
      return endOfMonth(month);
    case MONTH_RELATION.CURRENT:
    case MONTH_RELATION.FUTURE:
      return today;
    default: {
      const unexpectedRelation: never = relation;
      return unexpectedRelation;
    }
  }
};

export const monthRange = ({
  month,
  today,
}: MonthToday): { start: string; end: string } => ({
  start: startOfMonth(month),
  end: fireflyBalanceDate({ month, today }),
});

export const defaultTransactionDate = ({
  month,
  today,
}: MonthToday): string => {
  const relation = monthRelation({ month, today });

  switch (relation) {
    case MONTH_RELATION.CURRENT:
      return today;
    case MONTH_RELATION.PAST:
    case MONTH_RELATION.FUTURE:
      return startOfMonth(month);
    default: {
      const unexpectedRelation: never = relation;
      return unexpectedRelation;
    }
  }
};
