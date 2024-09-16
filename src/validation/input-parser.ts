import type { LabelCount, Quantity } from "src/types/expressions";

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

function parseLabels(input: string): LabelCount | undefined {
  if (input?.length === 0) return;

  const results: LabelCount = new Map();

  // Run the search and store the labels
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
  let buffer: RegExpExecArray | null;
  while ((buffer = labelSeparatorNeedle.exec(input)) !== null) {
    const [labelSubstring] = buffer;

    const validatedLabel = labelSubstring.match(labelNeedle);

    if (!validatedLabel) continue;

    const [, label, exponent] = validatedLabel;

    if (!label) continue;

    const prevCount = results.get(label) || 0;
    const count = Number.parseInt(exponent, 10) || 1;

    results.set(label, prevCount + count);

    // if (!exponent) {
    //   results.set(labelSubstring, 1);
    //   results.values();
    // } else {
    //   const count = Number.parseInt(exponent, 10);

    //   if (Number.isNaN(count)) results.set(labelSubstring, 1);
    //   else if (count <= 0) continue;
    //   else results.set(label, count);
    // }
  }

  if (results.size === 0) return;

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

  if (labels?.size === 0) return { factor };

  return { factor, labels };
}

/**
 * Convert a quantity to a string
 * @param quantity
 * @returns A string representation of the quantity
 */
export function stringifyQuantity(quantity?: Quantity) {
  if (!quantity) return "";

  const formattedLabels = [...quantity.labels || []]
    .map(([label, exponent]) => `${label}${exponent > 1 ? "^" + exponent : ""}`)
    .join(" ");

  return `${quantity.factor} ${formattedLabels}`.trim();
}
