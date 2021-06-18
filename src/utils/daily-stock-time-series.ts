import { bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import {
  StockAPIResponse,
  StockAPIResponseKeys,
  DailyStockTimeSeriesItemValues,
  DailyStockTimeSeriesItemValuesKeys,
} from '../services/getDailyStockTimeSeries';

enum NormalizedTimeSeriesItemValuesKeys {
  LOW = 'low',
  HIGH = 'high',
  AVERAGE = 'average',
}

type NormalizedTimeSeriesItemValues = {
  [key in NormalizedTimeSeriesItemValuesKeys]: number;
};

export type NormalizedTimeSeriesItem = {
  date: string;
  values: NormalizedTimeSeriesItemValues;
};

export type NormalizedTimeSeries = NormalizedTimeSeriesItem[];

export function normalizeStockData(
  stockAPIResponse: StockAPIResponse
): NormalizedTimeSeries {
  var timeSeries = Object.entries(
    stockAPIResponse[StockAPIResponseKeys.TIME_SERIES_DAILY]
  );

  if (timeSeries) {
    return timeSeries
      .map(keepOnlyHighLowAverageValues)
      .sort((item1, item2) => (item1.date > item2.date ? 1 : -1));
  } else {
    throw new Error('There is no data for the selected company 😕');
  }

  function keepOnlyHighLowAverageValues(
    timeSeriesItem: [string, DailyStockTimeSeriesItemValues]
  ) {
    const high = Number.parseFloat(
      timeSeriesItem[1][DailyStockTimeSeriesItemValuesKeys.HIGH]
    );
    const low = Number.parseFloat(
      timeSeriesItem[1][DailyStockTimeSeriesItemValuesKeys.LOW]
    );
    const average = +((high + low) / 2).toFixed(3);

    return {
      values: {
        low,
        high,
        average,
      },
      date: timeSeriesItem[0],
    };
  }
}

export function filterTimeSeries(
  normalizedData: NormalizedTimeSeries,
  dateRange: { start: Date; end: Date }
) {
  const startStringDate = dateRange.start.toISOString().split('T')[0];
  const endStringDate = dateRange.end.toISOString().split('T')[0];

  return normalizedData.filter(
    (item) => item.date >= startStringDate && item.date <= endStringDate
  );
}

export const getDate = (dataPoint: NormalizedTimeSeriesItem) =>
  new Date(dataPoint.date);
export const getStockHighValue = (dataPoint: NormalizedTimeSeriesItem) =>
  dataPoint.values.high;
export const getStockAverageValue = (dataPoint: NormalizedTimeSeriesItem) =>
  dataPoint.values.average;
export const bisectDate = bisector<NormalizedTimeSeriesItem, Date>(
  (dataPoint) => new Date(dataPoint.date)
).left;
export const formatDate = timeFormat("%b %d, '%y");
