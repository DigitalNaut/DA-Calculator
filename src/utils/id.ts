/**
 * Generate a random id
 *
 * See: https://stackoverflow.com/a/53116778
 * @returns
 */
export function randomId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
}
