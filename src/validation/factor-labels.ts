export const factorNeedle = /^-?\b\d+(?:\.\d+)?(?=$| )/; // e.g. 60 or 60.0
export const labelNeedle = /\b(?!\d+)[\p{L}\d\-_*#]+(?:\^\d+)?\b/gu; // e.g. m, grapes, m^2, m*n, foot-squared
export const labelExponentNeedle = /(.+?)\^(\d+)$/; // e.g. m^3
