import {
  Quantity,
  Ratio,
  Expression,
  QuantityPosition,
  BaseRatio,
  BaseExpression,
} from "src/types/expressions";
import { parseInput } from "src/validation/input-parser";

/**
 * Check if a quantity has labels
 * @param quantity
 * @returns
 */
const quantityHasLabels = (quantity?: Quantity) =>
  !!quantity && !!quantity.labels && quantity.labels.length > 0;

/**
 * Check if a quantity has a factor different from 1
 * @param quantity
 * @returns
 */
const quantityIsNotOne = (quantity?: Quantity) =>
  !!quantity && !!quantity.factor && quantity.factor !== 1;

/**
 * Check if a ratio is non-trivial (contains labels or factors different from 1/1)
 * @param ratio
 * @returns
 */
const isNonTrivialRatio = (ratio: Ratio) => {
  const { numerator, denominator } = ratio;

  // If the term has any labels or factors different from 1, it's non-trivial
  return (
    quantityHasLabels(numerator) ||
    quantityHasLabels(denominator) ||
    quantityIsNotOne(numerator) ||
    quantityIsNotOne(denominator)
  );
};

/**
 * Remove all 1/1 terms from an equation
 * @param expression
 * @returns The equation without 1/1 terms or a default equation if empty
 */
export const simplifyExpression = (expression: Expression): Expression => {
  const filteredExpression = expression.filter(isNonTrivialRatio);

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
) {
  const newExpression = [...expression];
  const prevTerm = newExpression[index];
  const newValue = parseInput(value);

  newExpression[index] = {
    ...prevTerm,
    [termPosition]: {
      ...newValue,
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
  isPositive: boolean,
) => {
  const result: HashTable = { ...hash };

  items.forEach((item) => {
    result[item] = (result[item] ?? 0) + (isPositive ? +1 : -1);
  });

  return result;
};

export function removeOverlap(arr1: string[], arr2: string[]) {
  const result: [string[], string[]] = [[], []];

  let hash = labelsToHash({}, arr1, true);
  hash = labelsToHash(hash, arr2, false);

  // Sort alphabetically and then by count
  const sortedLabels = Object.entries(hash)
    .sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    })
    // Remove labels with count 0
    .filter((a) => a[1] !== 0);

  for (const [label, count] of sortedLabels) {
    const absCount = Math.abs(count);
    result[count > 0 ? 0 : 1].push(
      label + (absCount > 1 ? `^${absCount}` : ""),
    );
  }

  return result;
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

export function newExpression(baseExpression?: BaseExpression): Expression {
  if (!baseExpression) return [newRatio()];

  return baseExpression.map((term) => newRatio(term));
}
