import { Quantity } from "src/types/expressions";

import {
  factorLabelNeedle,
  labelSeparatorNeedle,
  factorNeedle,
  labelNeedle,
} from "./factor-labels";

/**
 * Separates the factor from the labels in a string
 * @param input A string
 * @returns A tuple of [factor, labels] or null if the input is invalid
 */
export function separateFactorLabels(input: string): [string, string] | null {
  const match = input.match(factorLabelNeedle);

  if (!match) return null;

  return [match[1] ?? "", match[2] ?? ""];
}

function parseFactor(input: string): number {
  const match = input.match(factorNeedle);

  if (!match) return 1;

  const [, numberString, percent] = match;
  const result = Number.parseFloat(numberString);

  if (Number.isNaN(result)) return 1;
  if (Object.is(result, -0)) return 0;

  return percent === "%" ? result / 100 : result;
}

function parseLabels(input: string): string[] | undefined {
  if (input?.length === 0) return;

  const results: string[] = [];

  // Run the search and store the labels
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
  let buffer: RegExpExecArray | null;
  while ((buffer = labelSeparatorNeedle.exec(input)) !== null) {
    const [labelSubstring] = buffer;

    const validatedLabel = labelSubstring.match(labelNeedle);

    if (!validatedLabel) continue;

    const [, label, exponent] = validatedLabel;

    if (!exponent) {
      results.push(labelSubstring);
    } else {
      const count = Number.parseInt(exponent, 10);

      for (let i = 0; i < count; i++) {
        results.push(label);
      }
    }
  }

  if (results.length === 0) return;

  return results;
}

/**
 * Parse a string into a quantity
 * @param input
 * @returns A quantity object
 */
export function parseInput(input: string): Quantity | undefined {
  if (input.length === 0) return undefined;

  const match = separateFactorLabels(input);
  if (!match) return undefined;

  const [rawFactor, rawLabels] = match;

  const factor = parseFactor(rawFactor);
  const labels = parseLabels(rawLabels);

  if (labels?.length === 0) return { factor };

  return { factor, labels };
}

/**
 * Convert a quantity to a string
 * @param quantity
 * @returns A string representation of the quantity
 */
export function stringifyQuantity(quantity?: Quantity) {
  if (!quantity) return "";

  return `${quantity.factor} ${quantity.labels?.join(" ") || ""}`.trim();
}
