import { type ExpressionType } from "./types";

export const cleanUpExpression = (
  anExpression: ExpressionType
): ExpressionType => {
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

const count = <T>(arr: T[], value: T) => arr.filter((x) => x === value).length;
const uniqueSet = <T>(arr1: T[], arr2: T[]) =>
  Array.from(new Set(arr1.concat(arr2)));

export function removeOverlap<T>(arr1: T[], arr2: T[]) {
  const result: [T[], T[]] = [[], []];

  uniqueSet(arr1, arr2).forEach((item) => {
    const diff = count(arr1, item) - count(arr2, item);

    if (diff > 0) result[0].push(item);
    else if (diff < 0) result[1].push(item);
  });

  return result;
}
