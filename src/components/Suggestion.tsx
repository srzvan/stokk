import * as React from 'react';
import { Box, theme } from '@chakra-ui/react';

interface IProps {
  suggestion: string;
  setQuery: (value: string) => void;
  setIsStockSymbolSet: (value: boolean) => void;
}

const Suggestion: React.FC<IProps> = ({
  setQuery,
  suggestion,
  setIsStockSymbolSet,
}) => (
  <Box
    as="p"
    cursor="pointer"
    onClick={() => {
      setQuery(suggestion);
      setIsStockSymbolSet(true);
    }}
    borderBottom="1px solid transparent"
    _hover={{ borderBottomColor: theme.colors.gray[100] }}
  >
    {suggestion}
  </Box>
);

export default Suggestion;
