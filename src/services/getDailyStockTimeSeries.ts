export enum DailyStockTimeSeriesItemValuesKeys {
  HIGH = '2. high',
  LOW = '3. low',
}

export type DailyStockTimeSeriesItemValues = {
  [key in DailyStockTimeSeriesItemValuesKeys]: string;
};

export enum StockAPIResponseKeys {
  TIME_SERIES_DAILY = 'Time Series (Daily)',
}

type DailyStockTimeSeries = {
  [dateString: string]: DailyStockTimeSeriesItemValues;
};

export type StockAPIResponse = {
  [key in StockAPIResponseKeys]: DailyStockTimeSeries;
};

export async function getDailyStockTimeSeries(searchQuery: string) {
  try {
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
    let response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${searchQuery}&outputsize=full&apikey=${apiKey}`
    );

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
