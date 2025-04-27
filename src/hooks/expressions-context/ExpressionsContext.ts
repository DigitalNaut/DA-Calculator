import type { Coordinates } from "@dnd-kit/utilities";
import { createContext } from "react";

import type { Expression } from "src/types/expressions";

export type ExpressionRecord = {
  expression: Expression;
  coordinates: Coordinates;
};
export type ExpressionRecords = Map<string, ExpressionRecord>;

type ExpressionsProvider = {
  state: {
    expressions: ExpressionRecords;
  };
  actions: {
    addExpression: (expressionRecord?: Partial<ExpressionRecord>) => void;
    clearExpressions: () => void;
    removeExpression: (key: string) => void;
    updateExpression: (
      key: string,
      callback: (prevRecord: ExpressionRecord) => Partial<ExpressionRecord>,
    ) => void;
  };
};

export const ExpressionsContext = createContext<ExpressionsProvider | null>(
  null,
);
