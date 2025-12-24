import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store";
import "antd/dist/reset.css";

import { ConfigProvider } from "antd";

import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);
