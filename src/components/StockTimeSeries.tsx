import * as React from "react";
import { chakra } from "@chakra-ui/react";
import { Range } from "react-date-range";

import StockChart from "./StockChart";
import FilterStockTimeSeries from "./FilterStockTimeSeries";
import StockTimeSeriesLoader from "./StockTimeSeriesLoader";

import { filterTimeSeries, NormalizedTimeSeries, normalizeStockData } from "../utils/daily-stock-time-series";
import { extent } from "d3-array";

export type DateInterval = {
  key: string;
} & Range;

type StockTimeSeriesProps = {
  query: string;
  shouldFetchDailyStockTimeSeries: boolean;
  setShouldFetchDailyStockTimeSeries: (shouldFetchDailyStockTimeSeries: boolean) => void;
};

function StockTimeSeries(props: StockTimeSeriesProps) {
  const { query, shouldFetchDailyStockTimeSeries, setShouldFetchDailyStockTimeSeries } = props;

  const [fullStockTimeSeries, setFullStockTimeSeries] = React.useState<NormalizedTimeSeries>();
  const [showAverage, setShowAverage] = React.useState(false);
  const [filtered, setFiltered] = React.useState<NormalizedTimeSeries>();
  const [filterInterval, setFilterInterval] = React.useState<{ start: Date; end: Date }>();
  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (shouldFetchDailyStockTimeSeries) {
      fetchDailyStockTimeSeries();
    }

    /* ******************************** */
    async function fetchDailyStockTimeSeries() {
      try {
        setIsLoading(true);
        const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
        let response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${query}&outputsize=full&apikey=${apiKey}`
        );
        let stockTimeSeries = await response.json();
        let normalizedData = normalizeStockData(stockTimeSeries);
        let [min, max] = extent(normalizedData, dataPoint => dataPoint.date);

        setMinDate(min!);
        setMaxDate(max!);

        setFullStockTimeSeries(normalizedData);
        setShouldFetchDailyStockTimeSeries(false);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
  }, [shouldFetchDailyStockTimeSeries]);

  React.useLayoutEffect(() => {
    if (filterInterval?.start && filterInterval?.end && fullStockTimeSeries) {
      let filteredTimeSeries = filterTimeSeries(fullStockTimeSeries, filterInterval);

      setFiltered(filteredTimeSeries);
    }
  }, [filterInterval, fullStockTimeSeries]);

  return isLoading ? (
    <StockTimeSeriesLoader />
  ) : fullStockTimeSeries ? (
    <>
      <chakra.p gridColumn="2 / span 2">
        Stock data available between {minDate} and {maxDate}
      </chakra.p>
      <StockChart
        width={800}
        height={480}
        stockTimeSeries={filtered ?? fullStockTimeSeries}
        showAverage={showAverage}
      />

      <FilterStockTimeSeries
        minDate={minDate}
        maxDate={maxDate}
        setFilterInterval={setFilterInterval}
        setShowAverage={setShowAverage}
      />
    </>
  ) : (
    <chakra.p
      gridColumn="2 / -2"
      gridRow="1 / span 3"
      fontSize="3xl"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      Use the search in the header to select a company
    </chakra.p>
  );
}

export default StockTimeSeries;
