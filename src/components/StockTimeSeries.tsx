import * as React from "react";
import { Stack, chakra, Tag, TagLabel, HStack } from "@chakra-ui/react";
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

        if (stockTimeSeries) {
          let normalizedData = normalizeStockData(stockTimeSeries);
          let [min, max] = extent(normalizedData, dataPoint => dataPoint.date);

          setMinDate(min!);
          setMaxDate(max!);

          setFullStockTimeSeries(normalizedData);
          setShouldFetchDailyStockTimeSeries(false);
          setIsLoading(false);
        } else {
          throw new Error("There is no data for the selected company 😕");
        }
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
    <HStack spacing="10em">
      <Stack spacing={3} gridColumn="2 / span 1">
        <chakra.p>
          Stock data available between{" "}
          <Tag size="lg" variant="solid" fontSize="md">
            <TagLabel>{minDate}</TagLabel>
          </Tag>{" "}
          and{" "}
          <Tag size="lg" variant="solid" fontSize="md">
            <TagLabel>{maxDate}</TagLabel>
          </Tag>
        </chakra.p>
        <StockChart
          width={800}
          height={480}
          stockTimeSeries={filtered ?? fullStockTimeSeries}
          showAverage={showAverage}
        />
      </Stack>

      <FilterStockTimeSeries
        minDate={minDate}
        maxDate={maxDate}
        setFilterInterval={setFilterInterval}
        setShowAverage={setShowAverage}
      />
    </HStack>
  ) : (
    <chakra.p
      gridColumn="2 / -2"
      gridRow="1 / span 3"
      fontSize="3xl"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      Search for a company to load its stock data. Afterwards you can filter it using the calendar.
    </chakra.p>
  );
}

export default StockTimeSeries;
