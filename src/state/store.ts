import { configureStore } from "@reduxjs/toolkit";

import expressionsSlice from "src/features/expressions/expressionsSlice";

export const store = configureStore({
  reducer: { expressions: expressionsSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
