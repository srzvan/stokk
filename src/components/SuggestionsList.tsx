import * as React from "react";
import { Box, VStack, ScaleFade } from "@chakra-ui/react";

import Suggestion from "./Suggestion";

interface IProps {
  suggestions: string[];
  setQuery: (value: string) => void;
  setIsStockSymbolSet: (value: boolean) => void;
}

function SuggestionsList({ suggestions, setIsStockSymbolSet, setQuery }: IProps) {
  return (
    <VStack alignItems="start" maxHeight="10em" overflowY="auto">
      <Box w="100%">
        <ScaleFade initialScale={0.9} in={suggestions.length > 0}>
          {suggestions.map(suggestion => (
            <Suggestion
              key={suggestion}
              setQuery={setQuery}
              suggestion={suggestion}
              setIsStockSymbolSet={setIsStockSymbolSet}
            />
          ))}
        </ScaleFade>
      </Box>
    </VStack>
  );
}

export default SuggestionsList;
