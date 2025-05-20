/**
 * Checks if an object is empty, i.e. has no properties.
 *
 * @example
 * ```ts
 * isEmptyObject({}); // true
 * isEmptyObject({ a: 1 }); // false
 * ```
 * @param target
 * @returns
 */
export const isEmptyObject = (target: Record<string, unknown>) =>
  Object.keys(target).length === 0;
