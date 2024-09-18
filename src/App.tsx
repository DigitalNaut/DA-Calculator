import Home from "src/views/Home";

import ExpressionsProvider from "src/hooks/expressions-context/ExpressionsProvider";
import "src/index.css";

export default function App(): JSX.Element {
  return (
    <ExpressionsProvider>
      <Home />
    </ExpressionsProvider>
  );
}
