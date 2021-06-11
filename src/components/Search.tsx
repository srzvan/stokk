import * as React from "react";
import { Input, Stack, theme, chakra, Button, FormControl, FormHelperText } from "@chakra-ui/react";

import { TCompany } from "./App";
import SuggestionsList from "./SuggestionsList";
import { getSuggestions } from "../services/getSuggestions";
import { normalizeSuggestions } from "../utils/suggestions";

interface SearchProps {
  closeModal: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  setSelectedCompany: (newCompany: TCompany) => void;
  setShouldFetchDailyStockTimeSeries: (value: boolean) => void;
}

function Search({ setSelectedCompany, closeModal, setShouldFetchDailyStockTimeSeries, inputRef }: SearchProps) {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>();
  const [isStockSymbolSet, setIsStockSymbolSet] = React.useState(false);
  const [typingTimeout, setTypingTimeout] = React.useState<NodeJS.Timeout>();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (value.length > 1) {
      setTypingTimeout(setTimeout(() => fetchSuggestions(value), 1250));
    }

    setQuery(value);
    setIsStockSymbolSet(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShouldFetchDailyStockTimeSeries(true);
    setSelectedCompany({
      symbol: query.split(" - ")[0],
      companyName: query.split(" - ")[1],
    });
    closeModal();
  }

  async function fetchSuggestions(searchQuery: string) {
    setIsLoading(true);

    const suggestions = await getSuggestions(searchQuery);

    setSuggestions(normalizeSuggestions(suggestions));
    setIsLoading(false);
  }

  return (
    <chakra.form
      flex="0 0 25%"
      autoComplete="off"
      position="relative"
      onSubmit={handleSubmit}
      zIndex={theme.zIndices.dropdown}
    >
      <Stack spacing={3}>
        <Stack spacing={0}>
          <FormControl mb={2}>
            <Input
              required
              type="text"
              ref={inputRef}
              variant="flushed"
              name="searchQuery"
              onChange={handleChange}
              value={query.split(" - ")[0]}
              placeholder="e.g. GOOGL/Google"
            />
            <FormHelperText>
              Type the name of a stock symbol/company &amp; click on any of the suggestions
            </FormHelperText>
          </FormControl>
          {suggestions && suggestions?.length > 0 ? (
            <SuggestionsList suggestions={suggestions} setQuery={setQuery} setIsStockSymbolSet={setIsStockSymbolSet} />
          ) : null}
        </Stack>
        <Button type="submit" disabled={!isStockSymbolSet} isLoading={isLoading}>
          Load stock data for selected company
        </Button>
      </Stack>
    </chakra.form>
  );
}

export default Search;
