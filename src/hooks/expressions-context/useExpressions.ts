import { useContext } from "react";

import { ExpressionsContext } from "./ExpressionsContext";

export default function useExpressions() {
  const expressionsContext = useContext(ExpressionsContext);

  if (!expressionsContext)
    throw new Error(
      "useExpressions must be used within an ExpressionsProvider",
    );

  return expressionsContext;
}
