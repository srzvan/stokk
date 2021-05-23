import { Suggestion, SuggestionKeys, Suggestions } from "../services/getSuggestions";

export function normalizeSuggestions(suggestions: Suggestions) {
  return suggestions.bestMatches.map(keepOnlyCompanyAndSymbolName);
}

function keepOnlyCompanyAndSymbolName(suggestion: Suggestion) {
  return `${suggestion[SuggestionKeys.SYMBOL]} - ${suggestion[SuggestionKeys.NAME]}`;
}
