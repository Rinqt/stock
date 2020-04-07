import "./styles/index.css";
import "babel-polyfill";
import "typeface-muli";
import "./react-table-defaults";
import "./react-chartjs-2-defaults";
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import App from "app/App";

Sentry.init({
  dsn: "https://d313eaf531034399819b2b1703b8494f@sentry.io/4409514"
});
const render = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

window.onload = () => {
  render();
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
