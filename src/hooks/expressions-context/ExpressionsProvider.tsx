import type { PropsWithChildren } from "react";
import { useState } from "react";

import { createExpression } from "src/logic/expression-wrangler";
import type { Expression } from "src/types/expressions";
import { randomId } from "src/utils/id";

import { ExpressionsContext } from "./ExpressionsContext";

function ExpressionsCRUD(initialExpressions?: Expression[]) {
  const [expressions, setExpressions] = useState<Map<string, Expression>>(
    () =>
      new Map(
        initialExpressions?.map((expression) => [randomId(), expression]),
      ),
  );

  const addExpression = (expression?: Expression) => {
    const newExpression = createExpression(expression);
    const key = randomId();

    setExpressions((prevMap) => new Map(prevMap.set(key, newExpression)));
  };

  const removeExpression = (key: string) =>
    setExpressions((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });

  const clearExpressions = () => {
    expressions.clear();
    setExpressions(new Map());
  };

  const updateExpression = (key: string, expression: Expression) =>
    void expressions.set(key, expression);

  return {
    state: {
      expressions,
    },

    actions: {
      addExpression,
      removeExpression,
      clearExpressions,
      updateExpression,
    },
  };
}

const expression1 = createExpression([
  {
    numerator: { factor: 2, labels: new Map([["grapes", 1]]) },
    denominator: { factor: 1, labels: new Map([["m", 1]]) },
  },
  {
    numerator: { factor: 60, labels: new Map([["m", 1]]) },
    denominator: { factor: 1, labels: new Map([["h", 1]]) },
  },
  {
    numerator: { factor: 24, labels: new Map([["h", 1]]) },
    denominator: { factor: 1, labels: new Map([["d", 1]]) },
  },
  {
    numerator: { factor: 5, labels: new Map([["d", 1]]) },
  },
]);
// const expression2 = newExpression([
//   { numerator: { factor: 15, labels: new Map([["wood", 1]]) } },
//   {
//     numerator: { factor: 4, labels: new Map([["planks", 1]]) },
//     denominator: { factor: 1, labels: new Map([["wood", 1]]) },
//   },
//   {
//     numerator: { factor: 1, labels: new Map([["slabs", 1]]) },
//     denominator: { factor: 3, labels: new Map([["planks", 1]]) },
//   },
// ]);
// const expression3 = newExpression([
//   {
//     numerator: { factor: 2, labels: new Map([["grapes", 1]]) },
//     denominator: { factor: 1, labels: new Map([["m", 1]]) },
//   },
//   {
//     numerator: { factor: 60, labels: new Map([["m", 1]]) },
//     denominator: { factor: 1, labels: new Map([["h", 1]]) },
//   },
//   {
//     numerator: { factor: 24, labels: new Map([["h", 1]]) },
//     denominator: { factor: 1, labels: new Map([["d", 1]]) },
//   },
// ]);

export default function ExpressionsProvider({ children }: PropsWithChildren) {
  const expressionsCrud = ExpressionsCRUD([expression1]);

  return (
    <ExpressionsContext.Provider value={expressionsCrud}>
      {children}
    </ExpressionsContext.Provider>
  );
}