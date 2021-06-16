import * as React from "react";
import { extent } from "d3-array";
import { Range } from "react-date-range";
import { Stack, chakra, HStack, Text, useTheme } from "@chakra-ui/react";

import StockChart from "./StockChart";
import { AppActions, AppContext } from "./AppContext";
import FilterStockTimeSeries from "./FilterStockTimeSeries";
import StockTimeSeriesLoader from "./StockTimeSeriesLoader";
import { getDailyStockTimeSeries } from "../services/getDailyStockTimeSeries";
import { filterTimeSeries, NormalizedTimeSeries, normalizeStockData } from "../utils/daily-stock-time-series";

export type DateInterval = {
  key: string;
} & Range;

function StockTimeSeries() {
  const { company, shouldFetchStockData, dispatch } = React.useContext(AppContext);

  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAverage, setShowAverage] = React.useState(false);
  const [filtered, setFiltered] = React.useState<NormalizedTimeSeries>();
  const [filterInterval, setFilterInterval] = React.useState<{ start: Date; end: Date }>();
  const [fullStockTimeSeries, setFullStockTimeSeries] = React.useState<NormalizedTimeSeries>();

  React.useEffect(() => {
    if (shouldFetchStockData) {
      fetchDailyStockTimeSeries();
    }

    async function fetchDailyStockTimeSeries() {
      setIsLoading(true);
      let stockTimeSeries = await getDailyStockTimeSeries(company.symbol);

      if (stockTimeSeries) {
        let normalizedData = normalizeStockData(stockTimeSeries);
        let [min, max] = extent(normalizedData, dataPoint => dataPoint.date);

        setMinDate(min!);
        setMaxDate(max!);

        setFullStockTimeSeries(normalizedData);

        dispatch({
          type: AppActions.SHOULD_FETCH_STOCK_DATA,
          payload: false,
        });

        setIsLoading(false);
      } else {
        throw new Error("There is no data for the selected company 😕");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchStockData]);

  React.useLayoutEffect(() => {
    if (filterInterval?.start && filterInterval?.end && fullStockTimeSeries) {
      let filteredTimeSeries = filterTimeSeries(fullStockTimeSeries, filterInterval);

      setFiltered(filteredTimeSeries);
    }
  }, [filterInterval, fullStockTimeSeries]);

  const theme = useTheme();

  return isLoading ? (
    <StockTimeSeriesLoader />
  ) : fullStockTimeSeries ? (
    <HStack spacing="10em">
      <Stack spacing={3} gridColumn="2 / span 1">
        <Text as="h3">
          You're looking at stock data for{" "}
          <Text as="span" fontSize="2xl" fontWeight="semibold" color={theme.colors.blue[500]}>
            {company.name}
          </Text>{" "}
          between{" "}
          <Text as="span" fontSize="xl" fontWeight="semibold" color={theme.colors.blue[500]}>
            {minDate}
          </Text>{" "}
          and{" "}
          <Text as="span" fontSize="xl" fontWeight="semibold" color={theme.colors.blue[500]}>
            {maxDate}
          </Text>
        </Text>
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
