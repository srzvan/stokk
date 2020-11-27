import * as React from "react";
import { Button, chakra, FormControl, FormHelperText, FormLabel, Stack, Switch, theme } from "@chakra-ui/react";
import { DateRange } from "react-date-range";

import { DateInterval } from "./StockTimeSeries";

const ChakraDateRange = chakra(DateRange);

type FilterStockTimeSeriesProps = {
  setFilterInterval: (newFilterInterval: { start: Date; end: Date }) => void;
  setShowAverage: (newShowAverage: boolean) => void;
  minDate: string;
  maxDate: string;
};

const FilterStockTimeSeries = (props: FilterStockTimeSeriesProps) => {
  const { setFilterInterval, setShowAverage, minDate, maxDate } = props;

  const [dateRange, setDateRange] = React.useState<DateInterval[]>([
    {
      key: "selection",
      startDate: undefined,
      endDate: undefined,
    },
  ]);

  function handleDateIntervalChange(item: any) {
    setDateRange([item.selection]);
  }

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setShowAverage(event.target.checked);
  }

  function handleFilter() {
    setFilterInterval({
      //@ts-ignore
      start: dateRange[0].startDate,
      //@ts-ignore
      end: dateRange[0].endDate,
    });
  }

  return (
    <Stack spacing={3} gridColumn="3 / span 1">
      <FormControl>
        <FormLabel fontSize="lg">Date interval for stock time series</FormLabel>
        <ChakraDateRange
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          startDatePlaceholder="Start date"
          endDatePlaceholder="End date"
          ranges={dateRange}
          moveRangeOnFirstSelection={false}
          weekStartsOn={1}
          dateDisplayFormat="d MMM, yyyy"
          onChange={handleDateIntervalChange}
          border={`1px solid ${theme.colors.gray[100]}`}
          w="100%"
        />
        <FormHelperText fontSize="md">Select start &amp; end dates in order to filter the stock data</FormHelperText>
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="average-stock-value" mb="0">
          Show average stock value
        </FormLabel>
        <Switch id="average-stock-value" onChange={handleSwitchChange} />
      </FormControl>
      <Button type="submit" colorScheme="blue" variant="outline" onClick={handleFilter}>
        Filter
      </Button>
    </Stack>
  );
};

export default FilterStockTimeSeries;
