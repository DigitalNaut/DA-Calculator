import { type ExpressionType } from "./types";

export const cleanUpExpression = (anExpression: ExpressionType): ExpressionType => {
  const filteredExpression = anExpression.filter((unit) => {
    console.log(`${unit}:`, unit.toString() !== "1");
    return unit.toString() !== "1";
  });
  return filteredExpression.length > 0 ? filteredExpression : [[[1]]];
};

export const removeUnits = (
  anExpression: ExpressionType,
  index: number,
  callback: () => void,
  count = 1
): ExpressionType => {
  const splicedUnit = anExpression.splice(index, count);
  const wasUnitRemoved =
    splicedUnit.length &&
    splicedUnit.reduce((_, currUnit) => currUnit.toString() !== "1", false); // true if at least one unit was removed

  if (wasUnitRemoved) callback();

  if (anExpression.length === 0) return [[[1]]];

  return anExpression;
};
