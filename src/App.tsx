import Home from "src/views/Home";

import "src/index.css";
import ExpressionsProvider from "./hooks/expressions-context/ExpressionsProvider";

export default function App(): JSX.Element {
  return (
    <ExpressionsProvider>
      <div className="bg-gray-800 font-sans text-white">
        <Home />
      </div>
    </ExpressionsProvider>
  );
}
