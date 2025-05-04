import type {
  Quantity,
  Ratio,
  Expression,
  QuantityPosition,
  BaseRatio,
  BaseExpression,
  LabelCount,
} from "src/types/expressions";
import { randomId } from "src/utils/id";
import { parseInput } from "src/validation/input-parser";

const quantityHasNoLabels = (quantity?: Quantity) =>
  (quantity?.labels?.size || 0) === 0;

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
 * Remove all 1/1 terms from an expression
 * @param expression
 * @returns The expression without 1/1 terms or a default expression if empty
 */
export const simplifyExpression = (expression: Expression): Expression => {
  const filteredExpression = expression.filter(
    (ratio: Ratio) => !isRatioTrivial(ratio),
  );

  // If no non-trivial terms, return the default [{ numerator: { factor: 1 } }]
  return filteredExpression.length > 0 ? filteredExpression : [createRatio()];
};

/**
 * Add a new term to an expression
 * @param expression The expression to modify
 * @param index The index to insert the new term
 * @param ratio The term to insert
 * @returns A new expression object with the new term
 */
export function insertRatio(
  expression: Expression,
  index: number,
  ratio?: Ratio,
): Expression {
  return [
    ...expression.slice(0, index),
    ratio || createRatio(),
    ...expression.slice(index),
  ];
}

/**
 * Flip a term in an expression
 * @param expression The expression to modify
 * @param index The index of the term to flip
 */
export function flipUnit(expression: Expression, index: number) {
  const reference = expression[index];

  const newExpression = [...expression];

  newExpression[index] = {
    id: reference.id,
    numerator: reference.denominator || { factor: 1 },
    denominator: reference.numerator,
  };

  return newExpression;
}

/**
 * Update a term in an expression
 * @param expression The expression to modify
 * @param index The index of the term to update
 * @param termPosition The position of the term to update
 * @param value The new value of the term
 * @returns A new expression array  with the updated term
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
    newQuantity.labels?.size === 0
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
 * Remove a term from an expression
 * @param expression The expression to modify
 * @param index The index of the term to remove
 * @returns A new expression array with the removed term
 */
export const removeRatio = (
  expression: Expression,
  index: number,
): Expression => {
  if (index < 0 || index >= expression.length) return expression;

  const splicedExpression = expression
    .slice(0, index)
    .concat(expression.slice(index + 1));

  if (splicedExpression.length === 0) return [createRatio()];

  return splicedExpression;
};

export function cancelOutLabels(
  numeratorLabels: LabelCount,
  denominatorLabels: LabelCount,
) {
  const keys = new Set([
    ...numeratorLabels.keys(),
    ...denominatorLabels.keys(),
  ]);

  const reducedLabels = [...keys].reduce((reducedLabels, label) => {
    const numeratorCount = numeratorLabels.get(label) || 0;
    const denominatorCount = denominatorLabels.get(label) || 0;

    const newCount = numeratorCount - denominatorCount;

    if (newCount !== 0) reducedLabels.set(label, newCount);

    return reducedLabels;
  }, new Map<string, number>());

  return reducedLabels;
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

/**
 * Convert a map of labels to a string
 * @param labels
 * @returns
 */
export function stringifyLabels(labels: LabelCount) {
  const numeratorLabels: [string, number][] = [];
  const denominatorLabels: [string, number][] = [];

  labels.forEach((count, key) => {
    if (count > 0) numeratorLabels.push([key, count]);
    if (count < 0) denominatorLabels.push([key, -count]);
  });

  numeratorLabels.sort(sortLabels);
  denominatorLabels.sort(sortLabels);

  const numeratorLabelsString = numeratorLabels
    .map(([label, count]) => (count === 1 ? label : `${label}^${count}`))
    .join(" • ");
  const denominatorLabelsString = denominatorLabels
    .map(([label, count]) => (count === 1 ? label : `${label}^${count}`))
    .join(" • ");

  return denominatorLabels.length === 0
    ? numeratorLabelsString
    : `${numeratorLabelsString} / ${denominatorLabelsString}`;
}

/**
 * Create a new ratio
 * @param term
 * @returns
 */
export function createRatio(term?: BaseRatio): Ratio {
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
export function createExpression(baseExpression?: BaseExpression): Expression {
  if (!baseExpression) return [createRatio()];

  return baseExpression.map((term) => createRatio(term));
}
