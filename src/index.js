import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter basename="/BouncingSimulator">
    <App />
  </BrowserRouter>,

  document.getElementById("root")
);
