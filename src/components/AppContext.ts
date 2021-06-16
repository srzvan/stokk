import * as React from "react";

export type TCompany = {
  symbol: string;
  name: string;
};

export interface IAppState {
  company: TCompany;
  shouldFetchStockData: boolean;
}

interface IAppContext extends IAppState {
  dispatch: React.Dispatch<TAction>;
}

export enum AppActions {
  SET_COMPANY = "SET_COMPANY",
  SHOULD_FETCH_STOCK_DATA = "SHOULD_FETCH_STOCK_DATA",
}

export type TAction =
  | {
      type: AppActions.SET_COMPANY;
      payload: TCompany;
    }
  | {
      type: AppActions.SHOULD_FETCH_STOCK_DATA;
      payload: boolean;
    };

export const AppContext = React.createContext<IAppContext>({
  company: {
    symbol: "",
    name: "",
  },
  shouldFetchStockData: false,
  dispatch: () => undefined,
});
