import { createExpression } from "src/logic/expressions";

/**
 * Example expression
 *
 * @returns `(2grapes / 1m) * (60m / 1h) * (24h / 1d) * (5d)`
 */
export const expression1 = createExpression([
  {
    numerator: { factor: 2, labels: { grapes: 1 } },
    denominator: { factor: 1, labels: { m: 1 } },
  },
  {
    numerator: { factor: 60, labels: { m: 1 } },
    denominator: { factor: 1, labels: { h: 1 } },
  },
  {
    numerator: { factor: 24, labels: { h: 1 } },
    denominator: { factor: 1, labels: { d: 1 } },
  },
  {
    numerator: { factor: 5, labels: { d: 1 } },
  },
]);

/**
 * Example expression
 *
 * @returns `(15planks + (4planks / 1wood) + (1wood / 3planks))`
 */
export const expression2 = createExpression([
  { numerator: { factor: 15, labels: { planks: 1 } } },
  {
    numerator: { factor: 4, labels: { planks: 1 } },
    denominator: { factor: 1, labels: { wood: 1 } },
  },
  {
    numerator: { factor: 1, labels: { wood: 1 } },
    denominator: { factor: 3, labels: { planks: 1 } },
  },
]);

/**
 * Example expression
 *
 * @returns `(2grapes / 1m) * (60m / 1h) * (24h / 1d)`
 */
export const expression3 = createExpression([
  {
    numerator: { factor: 2, labels: { grapes: 1 } },
    denominator: { factor: 1, labels: { m: 1 } },
  },
  {
    numerator: { factor: 60, labels: { m: 1 } },
    denominator: { factor: 1, labels: { h: 1 } },
  },
  {
    numerator: { factor: 24, labels: { h: 1 } },
    denominator: { factor: 1, labels: { d: 1 } },
  },
]);
