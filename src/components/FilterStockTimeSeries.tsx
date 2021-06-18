import * as React from "react";
import { Range, DateRange } from "react-date-range";
import { Button, chakra, FormControl, FormHelperText, FormLabel, Stack, Switch } from "@chakra-ui/react";

const ChakraDateRange = chakra(DateRange);

type FilterStockTimeSeriesProps = {
  minDate: string;
  maxDate: string;
  setShowAverage: (newShowAverage: boolean) => void;
  setFilterInterval: (newFilterInterval: { start: Date; end: Date }) => void;
};

const FilterStockTimeSeries: React.FC<FilterStockTimeSeriesProps> = ({
  minDate,
  maxDate,
  setShowAverage,
  setFilterInterval,
}) => {
  const [dateRange, setDateRange] = React.useState<Pick<Range, "key" | "startDate" | "endDate">>({
    key: "selection",
    startDate: new Date(),
    endDate: new Date(),
  });

  function handleDateIntervalChange(item: any) {
    setDateRange(item.selection);
  }

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setShowAverage(event.target.checked);
  }

  function handleFilter() {
    setFilterInterval({
      start: dateRange.startDate!,
      end: dateRange.endDate!,
    });
  }

  return (
    <Stack spacing={3} gridColumn="3 / span 1">
      <FormControl>
        <FormLabel fontSize="lg">Date interval for stock time series</FormLabel>
        <ChakraDateRange
          w="100%"
          weekStartsOn={1}
          ranges={[dateRange]}
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          endDatePlaceholder="End date"
          dateDisplayFormat="d MMM, yyyy"
          startDatePlaceholder="Start date"
          moveRangeOnFirstSelection={false}
          onChange={handleDateIntervalChange}
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
