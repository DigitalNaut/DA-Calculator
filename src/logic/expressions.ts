import { produce } from "immer";
import type {
  BaseExpression,
  BaseRatio,
  Expression,
  LabelCount,
  Quantity,
  QuantityPosition,
  Ratio,
} from "src/types/expressions";
import { randomId } from "src/utils/id";
import { isEmptyObject } from "src/utils/objects";
import { parseInput } from "src/validation/input-parser";

const quantityHasNoLabels = (quantity?: Quantity) =>
  !quantity?.labels ? true : (Object.keys(quantity.labels).length || 0) === 0;

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

  if (
    termPosition === "denominator" &&
    newQuantity.factor === 1 &&
    newQuantity.labels &&
    isEmptyObject(newQuantity.labels)
  )
    return expression.slice();

  return produce(expression, (draft) => {
    draft[index][termPosition] = newQuantity;
  });
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
    ...Object.keys(numeratorLabels),
    ...Object.keys(denominatorLabels),
  ]);

  const reducedLabels = [...keys].reduce<LabelCount>((reducedLabels, label) => {
    const numeratorCount = numeratorLabels[label] || 0;
    const denominatorCount = denominatorLabels[label] || 0;

    const newCount = numeratorCount - denominatorCount;

    if (newCount !== 0) reducedLabels[label] = newCount;

    return reducedLabels;
  }, {});

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
 * @returns A string representation of the labels
 */
export function stringifyLabels(labels: LabelCount) {
  const numeratorLabels: [string, number][] = [];
  const denominatorLabels: [string, number][] = [];

  Object.entries(labels).forEach(([key, count]) => {
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
 * Convert a ratio to a string.
 *
 * Example:
 * ```ts
 * const ratio = {
 *  numerator: { factor: 2, labels: new Map([["m", 1], ["s", -1]]) },
 *  denominator: { factor: 3, labels: new Map([["kg", 1]]) },
 * };
 *
 * stringifyRatio(ratio); // "0.67 m / kg • s"
 * ```
 * @param ratio
 * @returns
 */
export function stringifyRatio(ratio: BaseRatio) {
  const resultFactor = `${(
    ratio.numerator.factor / (ratio.denominator?.factor || 1)
  )
    .toFixed(2)
    .replace(/\.0+$/, "")}`;

  const resultsLabels = cancelOutLabels(
    ratio.numerator.labels || {},
    ratio.denominator?.labels || {},
  );

  const stringifiedLabels = stringifyLabels(resultsLabels);

  return `${resultFactor} ${stringifiedLabels}`;
}

/**
 * Stringify an expression to a string
 * @param expression
 * @returns
 */
export function stringifyExpression(expression: Expression) {
  return `(${expression.map(stringifyRatio).join(") (")})`;
}

// TODO: Implement string to expression
// export function stringToExpression(string: string) { }

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

/**
 * Multiply all factors in an expression
 *
 * @example
 * ```ts
 * const expression = [
 *  { numerator: { factor: 2, labels: { m: 1 } }, denominator: { factor: 1, labels: { s: 1 } } },
 *  { numerator: { factor: 2, labels: { m: 1 } }, denominator: { factor: 2, labels: { s: 1 } } },
 * ];
 *
 * multiplyFactors(expression, "numerator"); // 4
 * multiplyFactors(expression, "denominator"); // 2
 * ```
 * @param expression
 * @param subunit
 * @returns
 */
function multiplyFactors(expression: Expression, subunit: QuantityPosition) {
  const reducedExpression = expression.reduce(
    (previousExpression, currentExpression) => {
      const factor = currentExpression[subunit]?.factor ?? 1;

      return previousExpression * factor;
    },
    1,
  );

  return reducedExpression;
}

/**
 * Compound all labels in an expression
 *
 * @example
 * ```ts
 * const expression = [
 *  { numerator: { factor: 1, labels: { m: 1 } }, denominator: { factor: 2, labels: { s: 1 } } },
 *  { numerator: { factor: 2, labels: { m: 1 } }, denominator: { factor: 1, labels: { s: 1 } } },
 * ];
 *
 * compoundLabels(expression, "numerator"); // { m: 2 }
 * compoundLabels(expression, "denominator"); // { s: 2 }
 * ```
 * @param expression
 * @param quantityPosition
 * @returns
 */
function compoundLabels(
  expression: Expression,
  quantityPosition: QuantityPosition,
) {
  const reducedExpression = expression.reduce<LabelCount>(
    (prevTerms, currentTerm) => {
      const labels = currentTerm[quantityPosition]?.labels;

      if (!labels) return prevTerms;

      for (const [label, count] of Object.entries(labels)) {
        const prevCount = prevTerms[label] || 0;
        prevTerms[label] = prevCount + count;
      }

      return prevTerms;
    },
    {},
  );

  return reducedExpression;
}

export function calculateResults(expression: Expression) {
  return {
    numerator: {
      factor: multiplyFactors(expression, "numerator"),
      labels: compoundLabels(expression, "numerator"),
    },
    denominator: {
      factor: multiplyFactors(expression, "denominator"),
      labels: compoundLabels(expression, "denominator"),
    },
  };
}
