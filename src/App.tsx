import type { JSX } from "react";
import { Provider } from "react-redux";

import Home from "src/views/Home";
import { store } from "./store/index.ts";

import "src/index.css";

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
