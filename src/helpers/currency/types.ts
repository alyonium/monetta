export type WalletCurrency = {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
};

export type ExchangeRate = {
  fromCode: string;
  toCode: string;
  rate: number;
  date: string;
};
