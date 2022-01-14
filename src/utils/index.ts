const count = <T>(arr: T[], value: T) => arr.filter((x) => x === value).length;
const uniqueSet = <T>(arr1: T[], arr2: T[]) => Array.from(new Set(arr1.concat(arr2)));

export function removeOverlap<T>(arr1: T[], arr2: T[]) {
  const result: [T[], T[]] = [[], []];

  uniqueSet(arr1, arr2).forEach((item) => {
    const diff = count(arr1, item) - count(arr2, item);
    if (diff > 0) result[0].push(item);
    else if (diff < 0) result[1].push(item);
  });

  return result;
}

export default {
  removeOverlap,
};
