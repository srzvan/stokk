export enum SuggestionKeys {
  SYMBOL = "1. symbol",
  NAME = "2. name",
}

export type Suggestion = {
  [key in SuggestionKeys]: string;
};

export interface Suggestions {
  bestMatches: Suggestion[];
}

export async function getSuggestions(searchQuery: string): Promise<Suggestions> {
  try {
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
    let response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery.toLowerCase()}&apikey=${apiKey}`
    );

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
