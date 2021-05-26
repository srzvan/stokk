import * as React from "react";
import { extent } from "d3-array";
import { Range } from "react-date-range";
import { Stack, chakra, Tag, TagLabel, HStack } from "@chakra-ui/react";

import StockChart from "./StockChart";
import FilterStockTimeSeries from "./FilterStockTimeSeries";
import StockTimeSeriesLoader from "./StockTimeSeriesLoader";
import { getDailyStockTimeSeries } from "../services/getDailyStockTimeSeries";
import { filterTimeSeries, NormalizedTimeSeries, normalizeStockData } from "../utils/daily-stock-time-series";

export type DateInterval = {
  key: string;
} & Range;

type StockTimeSeriesProps = {
  query: string;
  shouldFetchDailyStockTimeSeries: boolean;
  setShouldFetchDailyStockTimeSeries: (value: boolean) => void;
};

function StockTimeSeries({
  query,
  shouldFetchDailyStockTimeSeries,
  setShouldFetchDailyStockTimeSeries,
}: StockTimeSeriesProps) {
  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAverage, setShowAverage] = React.useState(false);
  const [filtered, setFiltered] = React.useState<NormalizedTimeSeries>();
  const [filterInterval, setFilterInterval] = React.useState<{ start: Date; end: Date }>();
  const [fullStockTimeSeries, setFullStockTimeSeries] = React.useState<NormalizedTimeSeries>();

  React.useEffect(() => {
    if (shouldFetchDailyStockTimeSeries) {
      fetchDailyStockTimeSeries();
    }

    async function fetchDailyStockTimeSeries() {
      setIsLoading(true);
      let stockTimeSeries = await getDailyStockTimeSeries(query);

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
          showAverage={showAverage}
          stockTimeSeries={filtered ?? fullStockTimeSeries}
        />
      </Stack>

      <FilterStockTimeSeries
        minDate={minDate}
        maxDate={maxDate}
        setShowAverage={setShowAverage}
        setFilterInterval={setFilterInterval}
      />
    </HStack>
  ) : (
    <chakra.p
      fontSize="3xl"
      display="flex"
      gridColumn="2 / -2"
      alignItems="center"
      gridRow="1 / span 3"
      justifyContent="center"
    >
      Search for a company to load its stock data. Afterwards you can filter it using the calendar.
    </chakra.p>
  );
}

export default StockTimeSeries;
