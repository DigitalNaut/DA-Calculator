import { Quantity } from "src/types/expressions";

import {
  factorNeedle,
  labelExponentNeedle,
  labelNeedle,
} from "./factor-labels";

function parseFactor(input: string): number {
  const match = input.match(factorNeedle);

  if (!match) return 1;

  const result = Number.parseFloat(match[0]);

  return Number.isNaN(result) ? 1 : result;
}

function parseLabels(input: string): string[] | undefined {
  if (input?.length === 0) return;

  const results: string[] = [];

  // Run the search and store the labels
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
  let buffer: RegExpExecArray | null;
  while ((buffer = labelNeedle.exec(input)) !== null) {
    const substring = buffer[0];

    // Support for exponents (e.g. m^3)
    const exponent = labelExponentNeedle.exec(substring);
    if (exponent === null) {
      results.push(substring);
    } else {
      const label = exponent[1];
      const count = Number.parseInt(exponent[2], 10);

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
  if (input?.length === 0) return undefined;

  const factor = parseFactor(input);
  const labels = parseLabels(input);

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
