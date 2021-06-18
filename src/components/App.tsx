import * as React from "react";
import { ChakraProvider, Box, Grid, extendTheme, Flex } from "@chakra-ui/react";

import { Header } from "./Header";
import { StockTimeSeries } from "./StockTimeSeries";
import { TAction, AppActions, AppContext, IAppState } from "./AppContext";

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

function reducer(state: IAppState, action: TAction) {
  switch (action.type) {
    case AppActions.SET_COMPANY:
      return { ...state, company: { ...action.payload } };
    case AppActions.SHOULD_FETCH_STOCK_DATA:
      return { ...state, shouldFetchStockData: action.payload };
  }
}

export const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    company: { symbol: "", name: "" },
    shouldFetchStockData: false,
  });

  return (
    <ChakraProvider theme={theme}>
      <Grid h="100%" templateRows="auto 1fr auto">
        <AppContext.Provider
          value={{ company: state.company, shouldFetchStockData: state.shouldFetchStockData, dispatch }}
        >
          <Header />
          <Flex as="main" fontSize="xl" justifyContent="center" alignItems="center">
            <StockTimeSeries />
          </Flex>
        </AppContext.Provider>
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
};
