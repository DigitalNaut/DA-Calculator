// Separate factor labels from the rest of the input
export const factorLabelNeedle =
  /^(?:(-?\p{N}+(?:\.\p{N}+)?%?)(?:\p{Z}+|\s+|$))?(.*)?$/u;
export const labelSeparatorNeedle = /(?<=^|\s|\p{Z})(.+?)(?=$|\s|\p{Z})/gu;

// Only numbers
export const factorNeedle = /^(-?\p{N}+(?:\.\p{N}+)?)(%?)$/u; // e.g. 60, -60, 60.0, -60.0, 60%, -60%, 60.0%, -60.0%

// Only labels
export const labelNeedle =
  /^((?:\p{Emoji_Presentation}|\p{L}|°)[\p{Emoji_Presentation}\p{L}\p{N}\-_#@~°!]*)(?:(?:\*{2}|\^)(\p{N}+))?$/u; // e.g. apple, m^3, area**2
