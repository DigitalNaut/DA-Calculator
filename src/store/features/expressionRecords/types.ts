import type { Coordinates } from "@dnd-kit/utilities";
import type { Expression } from "src/types/expressions";

export type ExpressionRecord = {
  id: string;
  expression: Expression;
  coordinates: Coordinates;
};

export type ExpressionRecords = { [id: string]: ExpressionRecord };
