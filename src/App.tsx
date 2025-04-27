import ExpressionsProvider from "src/hooks/expressions-context/ExpressionsProvider";
import Home from "src/views/Home";

import "src/index.css";

export default function App(): JSX.Element {
  return (
    <ExpressionsProvider>
      <Home />
    </ExpressionsProvider>
  );
}
