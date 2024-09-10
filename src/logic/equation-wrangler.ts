import {
  Quantity,
  Ratio,
  Expression,
  QuantityPosition,
  BaseRatio,
  BaseExpression,
} from "src/types/expressions";
import { parseInput } from "src/validation/input-parser";

const quantityHasNoLabels = (quantity?: Quantity) =>
  (quantity?.labels?.length || 0) === 0;

/**
 * Check if a quantity is non-trivial (contains labels or factors different from 1)
 * @param quantity
 * @returns
 */
export const quantityIsTrivial = (quantity?: Quantity) => {
  if (!quantity) return true;

  const equalsOne = quantity.factor === 1;
  const hasNoLabels = quantityHasNoLabels(quantity);

  return equalsOne && hasNoLabels;
};

/**
 * Check if a ratio is trivial if:
 * - (`1`/`undefined`)
 * - (`1`/`1`) or (`-1`/`-1`)
 * @param ratio The ratio to check
 * @returns True if the ratio is trivial
 */
export const isRatioTrivial = (ratio: Ratio) => {
  const { numerator, denominator } = ratio;

  // If the term has any labels or factors different from 1, it's non-trivial
  return (
    quantityHasNoLabels(numerator) &&
    quantityHasNoLabels(denominator) &&
    ((numerator.factor === 1 && !denominator) ||
      (numerator.factor === 1 && denominator?.factor === 1) ||
      (numerator.factor === -1 && denominator?.factor === -1))
  );
};

/**
 * Remove all 1/1 terms from an equation
 * @param expression
 * @returns The equation without 1/1 terms or a default equation if empty
 */
export const simplifyExpression = (expression: Expression): Expression => {
  const filteredExpression = expression.filter(
    (ratio: Ratio) => !isRatioTrivial(ratio),
  );

  // If no non-trivial terms, return the default [{ numerator: { factor: 1 } }]
  return filteredExpression.length > 0 ? filteredExpression : [newRatio()];
};

/**
 * Add a new term to an equation
 * @param expression The equation to modify
 * @param index The index to insert the new term
 * @param ratio The term to insert
 * @returns A new equation object with the new term
 */
export function insertRatio(
  expression: Expression,
  index: number,
  ratio?: Ratio,
): Expression {
  return [
    ...expression.slice(0, index),
    ratio || newRatio(),
    ...expression.slice(index),
  ];
}

/**
 * Update a term in an equation
 * @param expression The equation to modify
 * @param index The index of the term to update
 * @param termPosition The position of the term to update
 * @param value The new value of the term
 * @returns A new equation array  with the updated term
 */
export function updateRatio(
  expression: Expression,
  index: number,
  termPosition: QuantityPosition,
  value: string,
): Expression {
  if (index < 0 || index >= expression.length) return expression;

  const newQuantity = parseInput(value);

  if (!newQuantity) return expression;

  const newExpression = [...expression];
  const prevRatio = newExpression[index];

  if (
    termPosition === "denominator" &&
    newQuantity.factor === 1 &&
    !newQuantity.labels
  )
    return newExpression;

  newExpression[index] = {
    ...prevRatio,
    [termPosition]: {
      ...newQuantity,
    },
  };

  return newExpression;
}

/**
 * Remove a term from an equation
 * @param expression The equation to modify
 * @param index The index of the term to remove
 * @returns A new equation array with the removed term
 */
export const removeRatio = (
  expression: Expression,
  index: number,
): Expression => {
  if (index < 0 || index >= expression.length) return expression;

  const splicedExpression = expression
    .slice(0, index)
    .concat(expression.slice(index + 1));

  if (splicedExpression.length === 0) return [newRatio()];

  return splicedExpression;
};

type HashTable = { [key: string]: number };

const labelsToHash = (
  hash: HashTable,
  items: string[],
  isAdditive: boolean,
) => {
  const result: HashTable = { ...hash };

  items.forEach((item) => {
    result[item] = (result[item] ?? 0) + (isAdditive ? +1 : -1);
  });

  return result;
};

type LabelCount = [string, number];
type LabelCounts = [LabelCount[], LabelCount[]];

/**
 * Remove duplicates from two arrays of labels
 * @param arr1
 * @param arr2
 * @returns An array of unique labels, counted by how many times they appear
 */
function countDuplicateLabels(arr1: string[], arr2: string[]): LabelCounts {
  let hash: HashTable = {};
  hash = labelsToHash(hash, arr1, true);
  hash = labelsToHash(hash, arr2, false);

  return Object.entries(hash).reduce<LabelCounts>(
    (acc, [label, count]) => {
      if (count > 0) {
        acc[0].push([label, count]);
      } else if (count < 0) {
        acc[1].push([label, -count]); // Make count positive
      }
      return acc;
    },
    [[], []],
  );
}

const sortLabels = (
  [label, countA]: [string, number],
  [labelB, countB]: [string, number],
) => {
  if (countA !== countB) {
    return countB - countA;
  }
  return label.localeCompare(labelB);
};

const labelToExponent = (label: string, count: number) => {
  if (count > 1) return label + `^${count}`;
  return label;
};

export function cancelOutUnits(arr1: string[], arr2: string[]) {
  const [numeratorLabels, denominatorLabels] = countDuplicateLabels(arr1, arr2); // ["foo", 3]

  const sortedNumeratorLabels = numeratorLabels.sort(sortLabels);
  const sortedDenominatorLabels = denominatorLabels.sort(sortLabels);

  const exponentNumeratorLabels = sortedNumeratorLabels.map(([label, count]) =>
    labelToExponent(label, count),
  );
  const exponentDenominatorLabels = sortedDenominatorLabels.map(
    ([label, count]) => labelToExponent(label, count),
  );
  return [exponentNumeratorLabels, exponentDenominatorLabels];
}

/**
 * Generate a random id
 *
 * See: https://stackoverflow.com/a/53116778
 * @returns
 */
function randomId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
}

/**
 * Create a new ratio
 * @param term
 * @returns
 */
export function newRatio(term?: BaseRatio): Ratio {
  return {
    id: randomId(),
    numerator: { factor: 1 },
    ...term,
  };
}

/**
 * Create a new expression
 * @param baseExpression An array of ratios
 * @returns A new expression object
 */
export function newExpression(baseExpression?: BaseExpression): Expression {
  if (!baseExpression) return [newRatio()];

  return baseExpression.map((term) => newRatio(term));
}
