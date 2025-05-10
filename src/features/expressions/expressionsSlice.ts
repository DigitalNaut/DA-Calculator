import { createSlice } from "@reduxjs/toolkit";

import { createExpression } from "src/logic/expressions";
import type { Expression } from "src/types/expressions";
import { randomId } from "src/utils/id";

const initialState = {
  expressions: new Map<
    string,
    { expression: Expression; coordinates: { x: number; y: number } }
  >(),
};

export const expressionsSlice = createSlice({
  name: "expressions",
  initialState,
  reducers: {
    addExpression: (state, action) => {
      const { expression, coordinates } = action.payload;
      const newExpression = createExpression(expression);
      const newCoordinates = coordinates ?? { x: 0, y: 0 };
      const key = randomId();

      state.expressions.set(key, {
        expression: newExpression,
        coordinates: newCoordinates,
      });
    },
    removeExpression: (state, action) => {
      const key = action.payload;
      state.expressions.delete(key);
    },
    clearExpressions: (state) => {
      state.expressions.clear();
    },
    updateExpression: (state, action) => {
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
