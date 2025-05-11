import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { createExpression } from "src/logic/expressions";
import type { AppThunk } from "src/store";
import type { Expression } from "src/types/expressions";
import { randomId } from "src/utils/id";
import type { ExpressionRecord, ExpressionRecords } from "./types";

const expression1 = createExpression([
  {
    numerator: { factor: 2, labels: { grapes: 1 } },
    denominator: { factor: 1, labels: { m: 1 } },
  },
  {
    numerator: { factor: 60, labels: { m: 1 } },
    denominator: { factor: 1, labels: { h: 1 } },
  },
  {
    numerator: { factor: 24, labels: { h: 1 } },
    denominator: { factor: 1, labels: { d: 1 } },
  },
  {
    numerator: { factor: 5, labels: { d: 1 } },
  },
]);
// const expression2 = createExpression([
//   { numerator: { factor: 15, labels: { planks: 1 } } },
//   {
//     numerator: { factor: 4, labels: { planks: 1 } },
//     denominator: { factor: 1, labels: { wood: 1 } },
//   },
//   {
//     numerator: { factor: 1, labels: { wood: 1 } },
//     denominator: { factor: 3, labels: { planks: 1 } },
//   },
// ]);
// const expression3 = createExpression([
//   {
//     numerator: { factor: 2, labels: { grapes: 1 } },
//     denominator: { factor: 1, labels: { m: 1 } },
//   },
//   {
//     numerator: { factor: 60, labels: { m: 1 } },
//     denominator: { factor: 1, labels: { h: 1 } },
//   },
//   {
//     numerator: { factor: 24, labels: { h: 1 } },
//     denominator: { factor: 1, labels: { d: 1 } },
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
  if (!initialExpressions) return {};

  return initialExpressions.reduce<ExpressionRecords>((acc, expression) => {
    acc[randomId()] = { expression, coordinates: { x: 0, y: 0 } };
    return acc;
  }, {});
}

type AddExpressionPayload = {
  expression?: Expression;
  coordinates?: { x: number; y: number };
};

type RemoveExpressionPayload = string;

type UpdateExpressionPayload = {
  key: string;
  newRecord: Partial<ExpressionRecord>;
};

type SliceState = {
  expressions: ExpressionRecords;
};

const initialState: SliceState = {
  expressions: normalizeExpressions([expression1]),
};

const expressionRecordsSlice = createSlice({
  name: "expressions",
  initialState,
  reducers: {
    addExpression: (state, action: PayloadAction<AddExpressionPayload>) => {
      const { expression, coordinates } = action.payload;
      const newExpression = createExpression(expression);
      const newCoordinates = coordinates ?? { x: 0, y: 0 };
      const key = randomId();

      state.expressions[key] = {
        expression: newExpression,
        coordinates: newCoordinates,
      };
    },
    removeExpression: (
      state,
      action: PayloadAction<RemoveExpressionPayload>,
    ) => {
      const key = action.payload;
      if (!state.expressions[key]) return;
      delete state.expressions[key];
    },
    clearExpressions: (state) => {
      state.expressions = {};
    },
    updateExpression: (
      state,
      action: PayloadAction<UpdateExpressionPayload>,
    ) => {
      const { key, newRecord } = action.payload;
      if (!state.expressions[key]) return;

      const oldRecord = state.expressions[key];
      if (!oldRecord) return;

      state.expressions[key] = { ...oldRecord, ...newRecord };
    },
  },
});

const { actions, reducer } = expressionRecordsSlice;

export const {
  addExpression,
  removeExpression,
  clearExpressions,
  updateExpression,
} = actions;

export default reducer;

export function modifyExpression({
  key,
  callback,
}: {
  key: string;
  callback: (record: ExpressionRecord) => Partial<ExpressionRecord>;
}): AppThunk {
  return function (dispatch, getState) {
    const newRecord = callback(getState().expressionRecords.expressions[key]);
    dispatch(updateExpression({ key, newRecord }));
  };
}
