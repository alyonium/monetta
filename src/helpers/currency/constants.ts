export const EXCHANGE_RATES_PAGE_LIMIT = 50;

export const PRIMARY_CURRENCY_QUERY_KEY = ['currency', 'primary'] as const;
export const EXCHANGE_RATES_QUERY_KEY = ['currency', 'exchangeRates'] as const;

export const PRIMARY_CURRENCY_MISSING_ERROR = 'Primary currency is missing';
export const EXCHANGE_RATES_MISSING_ERROR = 'Exchange rates are missing';
export const UNAUTHENTICATED_ERROR_MESSAGE = 'Unauthenticated';
