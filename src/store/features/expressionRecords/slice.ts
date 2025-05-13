import type { Coordinates } from "@dnd-kit/utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";
import type { SetStateAction } from "react";

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
    const id = randomId();
    acc[id] = { id, expression, coordinates: { x: 0, y: 0 } };
    return acc;
  }, {});
}

type AddExpressionPayload = {
  expression?: Expression;
  coordinates?: { x: number; y: number };
};

type RemoveExpressionPayload = string;

type UpdateExpressionPayload = {
  id: string;
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
      const id = randomId();

      state.expressions[id] = {
        id,
        expression: newExpression,
        coordinates: newCoordinates,
      };
    },
    removeExpression: (
      state,
      action: PayloadAction<RemoveExpressionPayload>,
    ) => {
      const id = action.payload;
      if (!state.expressions[id]) return;
      delete state.expressions[id];
    },
    clearExpressions: (state) => {
      state.expressions = {};
    },
    updateExpression: (
      state,
      action: PayloadAction<UpdateExpressionPayload>,
    ) => {
      const { id, newRecord } = action.payload;
      if (!state.expressions[id]) return;

      const oldRecord = state.expressions[id];
      if (!oldRecord) return;

      state.expressions[id] = { ...oldRecord, ...newRecord };
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

const selectRecords = (state: RootState) => state.expressionRecords.expressions;

export const selectExpressionRecordEntries = createSelector(
  selectRecords,
  (records) => Object.values(records),
);

export const selectExpressionRecordById = (id: string) =>
  createSelector(selectRecords, (records) => records[id]);

export function modifyExpressionById({
  id,
  callback,
}: {
  id: string;
  callback: (expression: Expression) => Expression;
}): AppThunk {
  return function modifyExpression(dispatch, getState) {
    const prevRecord = getState().expressionRecords.expressions[id];
    const newExpression = callback(prevRecord.expression);
    dispatch(
      updateExpression({
        id,
        newRecord: produce(prevRecord, (draft) => {
          draft.expression = newExpression;
        }),
      }),
    );
  };
}

export function modifyCoordinatesById({
  id,
  callback,
}: {
  id: string;
  callback: (coordinates: Coordinates) => Coordinates;
}): AppThunk {
  return function modifyCoordinates(dispatch, getState) {
    const prevRecord = getState().expressionRecords.expressions[id];
    const newCoordinates = callback(prevRecord.coordinates);
    dispatch(
      updateExpression({
        id,
        newRecord: produce(prevRecord, (draft) => {
          draft.coordinates = newCoordinates;
        }),
      }),
    );
  };
}

export function removeExpressionById(id: string): AppThunk {
  return function remove(dispatch) {
    dispatch(removeExpression(id));
  };
}

export function setInput(
  id: string,
  expression: SetStateAction<Expression>,
): AppThunk {
  return function setInputThunk(dispatch) {
    dispatch(
      modifyExpressionById({
        id,
        callback: (record) =>
          expression instanceof Function ? expression(record) : expression,
      }),
    );
  };
}
