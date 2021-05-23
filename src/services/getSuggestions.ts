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

export async function getSuggestions(query: string): Promise<Suggestions> {
  try {
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
    let response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query.toLowerCase()}&apikey=${apiKey}`
    );

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
