import * as React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript } from "@chakra-ui/react";

import { App } from "./components/App";

import * as serviceWorker from "./serviceWorker";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
