import * as React from "react";
import {
  Box,
  Button,
  chakra,
  FormControl,
  FormHelperText,
  Input,
  ScaleFade,
  Stack,
  theme,
  VStack,
} from "@chakra-ui/react";

enum SuggestionKeys {
  SYMBOL = "1. symbol",
  NAME = "2. name",
}

type Suggestion = {
  [key in SuggestionKeys]: string;
};

type Suggestions = {
  bestMatches: Suggestion[];
};

type SearchProps = {
  query: string;
  setQuery: (newQuery: string) => void;
  closeModal: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  setShouldFetchDailyStockTimeSeries: (shouldFetchDailyStockTimeSeries: boolean) => void;
};

function Search(props: SearchProps) {
  const { query, setQuery, closeModal, setShouldFetchDailyStockTimeSeries } = props;

  const [suggestions, setSuggestions] = React.useState<string[]>();
  const [typingTimeout, setTypingTimeout] = React.useState<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStockSymbolSet, setIsStockSymbolSet] = React.useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (query.length > 1) {
      setTypingTimeout(setTimeout(() => fetchSuggestions(value), 1250));
    }

    setQuery(value);
    setIsStockSymbolSet(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShouldFetchDailyStockTimeSeries(true);
    closeModal();
  }

  async function fetchSuggestions(query: string) {
    try {
      setIsLoading(true);

      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
      let response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query.toLowerCase()}&apikey=${apiKey}`
      );
      let responseData = await response.json();

      setSuggestions(normalizeSuggestions(responseData));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function normalizeSuggestions(suggestions: Suggestions) {
    return suggestions.bestMatches.map(keepOnlyCompanyAndSymbolName);

    /* ************************************ */
    function keepOnlyCompanyAndSymbolName(suggestion: Suggestion) {
      return `${suggestion[SuggestionKeys.SYMBOL]} - ${suggestion[SuggestionKeys.NAME]}`;
    }
  }

  function renderSuggestions() {
    if (query !== "" && suggestions && suggestions?.length > 0) {
      return (
        <VStack alignItems="start" maxHeight="10em" overflowY="auto">
          <Box w="100%">
            <ScaleFade initialScale={0.9} in={suggestions.length > 0}>
              {suggestions?.map(renderSuggestion)}
            </ScaleFade>
          </Box>
        </VStack>
      );
    }

    return null;

    /* ******************************** */
    function renderSuggestion(suggestion: string, index: number) {
      return (
        <Box
          as="p"
          onClick={() => {
            setIsStockSymbolSet(true);
            setQuery(suggestion.split(" - ")[0]);
          }}
          key={index}
          borderBottom="1px solid transparent"
          cursor="pointer"
          _hover={{ borderBottomColor: theme.colors.gray[100] }}
        >
          {suggestion}
        </Box>
      );
    }
  }

  return (
    <chakra.form
      onSubmit={handleSubmit}
      autoComplete="off"
      flex="0 0 25%"
      position="relative"
      zIndex={theme.zIndices.dropdown}
    >
      <Stack spacing={3}>
        <Stack spacing={0}>
          <FormControl mb={2}>
            <Input
              ref={props.inputRef}
              name="query"
              type="text"
              placeholder="e.g. GOOGL/Google"
              required
              onChange={handleChange}
              value={query}
              variant="flushed"
            />
            <FormHelperText>
              Type the name of a stock symbol/company &amp; click on any of the suggestions
            </FormHelperText>
          </FormControl>
          {renderSuggestions()}
        </Stack>
        <Button type="submit" disabled={!isStockSymbolSet} isLoading={isLoading}>
          Load stock data for selected company
        </Button>
      </Stack>
    </chakra.form>
  );
}

export default Search;
