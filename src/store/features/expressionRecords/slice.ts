import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";

import { createExpression } from "src/logic/expressions";
import type { AppThunk, RootState } from "src/store";
import type { Expression } from "src/types/expressions";
import { randomId } from "src/utils/id";
import { expression1 } from "./presets";
import type { ExpressionRecord, ExpressionRecords } from "./types";

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
    const key = randomId();
    acc[key] = { key, expression, coordinates: { x: 0, y: 0 } };
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
        key,
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

export function selectExpressionRecords() {
  return createSelector(
    (state: RootState) => state.expressionRecords,
    (records) => records.expressions,
  );
}

export function modifyExpression({
  key,
  callback,
}: {
  key: string;
  callback: (record: ExpressionRecord) => Partial<ExpressionRecord>;
}): AppThunk {
  return function modify(dispatch, getState) {
    const newRecord = callback(getState().expressionRecords.expressions[key]);
    dispatch(updateExpression({ key, newRecord }));
  };
}
