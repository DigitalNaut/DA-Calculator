/**
 * Checks if an object is empty, i.e. has no properties.
 *
 * @example
 * ```ts
 * isEmptyObject({ a: 1, b: 2 }); // false
 * isEmptyObject({}); // true
 * ```
 * @param ad
 * @returns
 */
export function isEmptyObject(ad: object) {
  for (const prop in ad) {
    if (Object.prototype.hasOwnProperty.call(ad, prop)) {
      return false;
    }
  }
  return true;
}
