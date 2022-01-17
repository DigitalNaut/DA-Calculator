import { IExpression } from './types';

export const cleanUpExpression = (anExpression: IExpression): IExpression => {
  const filteredExpression = anExpression.filter((unit) => {
    console.log(`${unit}:`, unit.toString() !== '1');
    return unit.toString() !== '1';
  });
  return filteredExpression.length > 0 ? filteredExpression : [[[1]]];
};

export const removeUnits = (
  anExpression: IExpression,
  index: number,
  callback: () => void,
  count = 1,
): IExpression => {
  const splicedUnit = anExpression.splice(index, count);
  const wasUnitRemoved =
    splicedUnit.length &&
    splicedUnit.reduce((prevUnit, currUnit) => {
      return currUnit.toString() !== '1';
    }, false);

  if (wasUnitRemoved) callback();

  if (anExpression.length === 0) return [[[1]]];

  return anExpression;
};
