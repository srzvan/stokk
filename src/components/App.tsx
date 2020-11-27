import * as React from "react";
import { ChakraProvider, Box, Grid, extendTheme, theme as defaultTheme, Flex } from "@chakra-ui/react";

import Header from "./Header";
import StockTimeSeries from "./StockTimeSeries";

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
      },
      ".rdrDateDisplayWrapper": {
        background: "transparent",
      },
      ".rdrNextPrevButton": {
        background: defaultTheme.colors.blue[100],
      },
      ".rdrDateDisplayItem": {
        borderColor: defaultTheme.colors.blue[200],
        background: "transparent",
      },
      ".rdrDateDisplay": {
        margin: 0,
      },
      ".rdrDateDisplayItemActive": {
        color: defaultTheme.colors.yellow[200],
        borderColor: defaultTheme.colors.yellow[200],
      },
      ".rdrDateDisplayItem.rdrDateDisplayItemActive input[readonly]": {
        color: defaultTheme.colors.yellow[200],
      },
      ".rdrDateDisplayWrapper input[readonly]::placeholder": {
        color: defaultTheme.colors.blue[200],
      },
      ".rdrDateDisplayWrapper input[readonly]": {
        color: defaultTheme.colors.blue[200],
        background: "transparent",
      },
      ".rdrMonthAndYearPickers select": {
        border: `1px solid ${defaultTheme.colors.blue[200]}`,
        color: defaultTheme.colors.blue[200],
      },
      ".rdrMonthAndYearPickers select:hover": {
        background: defaultTheme.colors.whiteAlpha[200],
      },
      ".rdrMonth": {
        alignSelf: "center",
      },
      ".rdrDateRangeWrapper": {
        background: "transparent",
      },
      ".rdrDayNumber span": {
        color: defaultTheme.colors.whiteAlpha[900],
      },
      ".rdrDayPassive .rdrDayNumber span": {
        color: defaultTheme.colors.whiteAlpha[300],
      },
      ".rdrDayDisabled": {
        background: defaultTheme.colors.blackAlpha[500],
      },
    },
  },
});

export function App() {
  const [query, setQuery] = React.useState("");
  const [shouldFetchDailyStockTimeSeries, setShouldFetchDailyStockTimeSeries] = React.useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Grid h="100%" templateRows="auto 1fr auto">
        <Header
          query={query}
          setQuery={setQuery}
          setShouldFetchDailyStockTimeSeries={setShouldFetchDailyStockTimeSeries}
        />
        <Flex as="main" fontSize="xl" justifyContent="center" alignItems="center">
          <StockTimeSeries
            query={query}
            shouldFetchDailyStockTimeSeries={shouldFetchDailyStockTimeSeries}
            setShouldFetchDailyStockTimeSeries={setShouldFetchDailyStockTimeSeries}
          />
        </Flex>
        <Box as="footer" p={5} fontSize="xl" textAlign="center">
          <p>
            Made with{" "}
            <span role="img" aria-labelledby="Heart">
              💖
            </span>{" "}
            by Răzvan Sbîngu
          </p>
        </Box>
      </Grid>
    </ChakraProvider>
  );
}
