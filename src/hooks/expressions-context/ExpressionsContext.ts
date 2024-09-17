import { createContext } from "react";

import type { Expression } from "src/types/expressions";

type ExpressionsProvider = {
  state: {
    expressions: Map<string, Expression>;
  };
  actions: {
    addExpression: (expression?: Expression) => void;
    removeExpression: (key: string) => void;
    clearExpressions: () => void;
    updateExpression: (key: string, expression: Expression) => void;
  };
};

export const ExpressionsContext = createContext<ExpressionsProvider | null>(
  null,
);
