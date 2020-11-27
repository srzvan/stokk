export enum DailyStockTimeSeriesItemValuesKeys {
  HIGH = "2. high",
  LOW = "3. low",
}

export type DailyStockTimeSeriesItemValues = {
  [key in DailyStockTimeSeriesItemValuesKeys]: string;
};

export enum StockAPIResponseKeys {
  TIME_SERIES_DAILY = "Time Series (Daily)",
}

type DailyStockTimeSeries = {
  [dateString: string]: DailyStockTimeSeriesItemValues;
};

export type StockAPIResponse = {
  [key in StockAPIResponseKeys]: DailyStockTimeSeries;
};
