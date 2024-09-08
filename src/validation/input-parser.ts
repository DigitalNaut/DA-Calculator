import { Quantity } from "src/types/expressions";

import {
  factorNeedle,
  labelExponentNeedle,
  labelNeedle,
} from "./factor-labels";

function parseFactor(
  input: string,
  callback?: (lastIndex: number) => void,
): number {
  // Guard no input
  if (input?.length === 0) {
    callback?.(0);
    return 1;
  }

  const match = input.match(factorNeedle);

  if (match) {
    callback?.(factorNeedle.lastIndex);
    return Number.parseFloat(match[0]) ?? 1;
  }

  callback?.(0);
  return 1;
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
    const power = labelExponentNeedle.exec(substring);

    if (power === null) {
      results.push(substring);
    } else {
      const label = power[1];
      const count = Number.parseInt(power[2], 10);

      for (let i = 0; i < count; i++) {
        results.push(label);
      }
    }
  }

  if (results.length === 0) return;

  return results;
}

export function parseInput(input: string): Quantity {
  if (input?.length === 0) return { factor: 1 };

  const factor = parseFactor(input);
  const labels = parseLabels(input);

  return { factor, labels };
}

export function stringifyTerm(quantity?: Quantity) {
  if (!quantity) return "";

  return `${quantity.factor} ${quantity.labels?.join(" ") || ""}`.trim();
}
