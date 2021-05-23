import * as React from "react";
import { Box, theme } from "@chakra-ui/react";

interface IProps {
  suggestion: string;
  setQuery: (value: string) => void;
  setIsStockSymbolSet: (value: boolean) => void;
}

function Suggestion({ suggestion, setIsStockSymbolSet, setQuery }: IProps) {
  return (
    <Box
      as="p"
      cursor="pointer"
      borderBottom="1px solid transparent"
      onClick={() => {
        setIsStockSymbolSet(true);
        setQuery(suggestion.split(" - ")[0]);
      }}
      _hover={{ borderBottomColor: theme.colors.gray[100] }}
    >
      {suggestion}
    </Box>
  );
}

export default Suggestion;
