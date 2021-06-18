import * as React from "react";
import { Box, CircularProgress, Stack, theme } from "@chakra-ui/react";

export const StockTimeSeriesLoader: React.FC = () => (
  <Stack gridColumn="2 / span 2" gridRow="1 / -1" justifySelf="center" alignSelf="center">
    <Box as="p">Loading company data...</Box>
    <CircularProgress isIndeterminate size="3xs" color={theme.colors.teal[500]} />
  </Stack>
);
