import { ICompoundInput as ILabel } from './types';

export const identityNeedle = /^1?$/;

export const labelOnlyNeedle = /^_?[A-Za-zÀ-ÖØ-öø-ÿ][\wÀ-ÖØ-öø-ÿ -]*$/;
export const factorOnlyNeedle = /^(\d+(?:\.\d+)?) ?$/;
export const factorLabelNeedle = /^(\d+(?:\.\d+)?) ?(_?[A-Za-zÀ-ÖØ-öø-ÿ][\wÀ-ÖØ-öø-ÿ-]*)+ ?$/;

export const allLegalInputNeedle = new RegExp(
  `${/ ?/.source}|${labelOnlyNeedle.source}|${factorOnlyNeedle.source}|${factorLabelNeedle.source}`,
);

export const allValidInputNeedle = new RegExp(
  `${factorOnlyNeedle.source}|${factorLabelNeedle.source}`,
);

export function makeCompoundValue(haystack: string): ILabel {
  if (haystack?.length === 0) return [1];

  const results = factorLabelNeedle.exec(haystack);
  return [Number(results?.[1] || 1), results?.[2]];
}

export function stringifyIntoLabel(userInput?: string | ILabel) {
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
