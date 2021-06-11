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

export type TCompany = {
  symbol: string;
  companyName: string;
};

export function App() {
  const [selectedCompany, setSelectedCompany] = React.useState<TCompany>({ symbol: "", companyName: "" });
  const [shouldFetchDailyStockTimeSeries, setShouldFetchDailyStockTimeSeries] = React.useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Grid h="100%" templateRows="auto 1fr auto">
        <Header
          setSelectedCompany={setSelectedCompany}
          setShouldFetchDailyStockTimeSeries={setShouldFetchDailyStockTimeSeries}
        />
        <Flex as="main" fontSize="xl" justifyContent="center" alignItems="center">
          <StockTimeSeries
            selectedCompany={selectedCompany}
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
