import { createSlice } from "@reduxjs/toolkit";

import { createExpression } from "src/logic/expressions";
import type { Expression } from "src/types/expressions";
import { randomId } from "src/utils/id";
import type { ExpressionRecord, ExpressionRecords } from "./types";

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

/**
 * Adds a random ID and default coordinates to each expression in the array.
 * The coordinates are set to { x: 0, y: 0 } by default.
 * @param initialExpressions
 * @returns
 */
function normalizeExpressions(
  initialExpressions?: Expression[],
): ExpressionRecords {
  return new Map(
    initialExpressions?.map((expression) => [
      randomId(),
      { expression, coordinates: { x: 0, y: 0 } },
    ]),
  );
}

const initialState = {
  expressions: new Map(normalizeExpressions([expression1])),
};

type AddExpressionPayload = {
  expression?: Expression;
  coordinates?: { x: number; y: number };
};

type RemoveExpressionPayload = string;

type UpdateExpressionPayload = {
  key: string;
  callback: (record: ExpressionRecord) => Partial<ExpressionRecord>;
};

const expressionsSlice = createSlice({
  name: "expressions",
  initialState,
  reducers: {
    addExpression: (state, action: { payload: AddExpressionPayload }) => {
      const { expression, coordinates } = action.payload;
      const newExpression = createExpression(expression);
      const newCoordinates = coordinates ?? { x: 0, y: 0 };
      const key = randomId();

      state.expressions.set(key, {
        expression: newExpression,
        coordinates: newCoordinates,
      });
    },
    removeExpression: (state, action: { payload: RemoveExpressionPayload }) => {
      const key = action.payload;
      state.expressions.delete(key);
    },
    clearExpressions: (state) => {
      state.expressions.clear();
    },
    updateExpression: (state, action: { payload: UpdateExpressionPayload }) => {
      const { key, callback } = action.payload;
      if (!state.expressions.has(key)) return;

      const record = state.expressions.get(key);
      if (!record) return;

      const newRecord = callback(record);

      state.expressions.set(key, { ...record, ...newRecord });
    },
  },
});

export const {
  addExpression,
  removeExpression,
  clearExpressions,
  updateExpression,
} = expressionsSlice.actions;

export default expressionsSlice.reducer;
