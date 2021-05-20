import * as React from "react";
import { ChakraProvider, Box, Grid, extendTheme, Flex } from "@chakra-ui/react";

import Header from "./Header";
import StockTimeSeries from "./StockTimeSeries";

const theme = extendTheme({
  initialColorMode: "dark",
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
      },
      ".rdrMonth": {
        alignSelf: "center",
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
