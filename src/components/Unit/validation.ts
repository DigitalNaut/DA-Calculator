import { ICompoundInput } from './types';

export const labelOnlyNeedle = /^_?[A-Za-zÀ-ÖØ-öø-ÿ][\w -]*$/;
export const factorOnlyneedle = /^(\d+(?:\.\d+)?) ?$/;
export const factorLabelNeedle = /^(\d+(?:\.\d+)?) ?(_?[A-Za-zÀ-ÖØ-öø-ÿ][\w-]*)+ ?$/;

export const allLegalInputNeedle = new RegExp(
  `${/ ?/.source}|${labelOnlyNeedle.source}|${factorOnlyneedle.source}|${factorLabelNeedle.source}`,
);

export const allValidInputNeedle = new RegExp(
  `${factorOnlyneedle.source}|${factorLabelNeedle.source}`,
);

export function makeCompoundValue(haystack: string): ICompoundInput {
  if (haystack?.length === 0) return [1];

  const results = factorLabelNeedle.exec(haystack);
  return [Number(results?.[1] || 1), results?.[2]];
}

export function stringifyValue(userInput?: string | ICompoundInput) {
  if (typeof userInput === 'string') {
    if (labelOnlyNeedle.test(userInput)) return `1 ${userInput}`;
    return userInput;
  }

  return userInput?.join(' ').trim() || '';
}

export default {
  factorLabelNeedle,
  labelOnlyNeedle,
};
