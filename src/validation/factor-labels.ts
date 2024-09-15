// Separate factor labels from the rest of the input
export const factorLabelNeedle =
  /^(?:(-?\p{N}+(?:\.\p{N}+)?%?)(?:\p{Z}+|\s+|$))?(.*)?$/u;
export const labelSeparatorNeedle = /(?<=^|\s|\p{Z})(.+?)(?=$|\s|\p{Z})/gu;

// Only numbers
export const factorNeedle = /^(-?\p{N}+(?:\.\p{N}+)?)(%?)$/u; // e.g. 60, -60, 60.0, -60.0, 60%, -60%, 60.0%, -60.0%

// Only labels
// See: https://www.stefanjudis.com/snippets/how-to-detect-emojis-in-javascript-strings/
// See: https://mathiasbynens.be/notes/es-unicode-property-escapes
export const labelNeedle =
  /^((?:\p{L}|°|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)[\p{Emoji}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}\uFE0F\p{Emoji_Presentation}\p{Join_Control}\p{L}\p{N}\-_#@~°!]*)(?:\^(\p{N}+))?$/u; // e.g. apple, m^3, area**2, 🍎^2
