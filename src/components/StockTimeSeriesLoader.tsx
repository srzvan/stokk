import * as React from 'react';
import { Box, CircularProgress, Stack, theme } from '@chakra-ui/react';

export const StockTimeSeriesLoader: React.FC = () => (
  <Stack
    gridRow="1 / -1"
    alignSelf="center"
    justifySelf="center"
    gridColumn="2 / span 2"
  >
    <Box as="p">Loading company data...</Box>
    <CircularProgress
      size="3xs"
      isIndeterminate
      color={theme.colors.teal[500]}
    />
  </Stack>
);
