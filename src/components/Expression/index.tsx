import React, { useEffect, useMemo, useState } from 'react';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IExpression } from 'src/components/Expression/types';
import Unit from 'src/components/Unit';
import { removeOverlap } from 'src/utils';
import { CustomInputChangeHandler, IInput } from 'src/components/Unit/types';
import Output from 'src/components/Output';
import { makeCompoundValue, stringifyIntoLabel } from 'src/components/Unit/validation';

import Inserter from './Separator';
import { cleanUpExpression, removeUnits } from './utility';

type Props = {
  input: IExpression;
};

export default function Expression({ input }: Props) {
  const [expression, setExpression] = useState(input);
  const [update, setUpdate] = useState(0);
  const [numerator, setNumerator] = useState(0);
  const [denominator, setDenominator] = useState(0);
  const [labels, setLabels] = useState<string[][]>();
  const [wasInputChanged, setWasInputChanged] = useState(false);

  useEffect(() => {}, [expression, update]);

  const reduceFactors = (index: 0 | 1) =>
    expression.reduce((previousExpression, currentExpression) => {
      const factor = Number(currentExpression[index]?.[0]) || 1;
      return typeof currentExpression[index]?.[0] === 'number'
        ? previousExpression * factor
        : previousExpression;
    }, 1);

  const reduceLabels = (index: 0 | 1) =>
    expression.reduce((previousExpression, currentExpression) => {
      if (typeof currentExpression[index]?.[1] === 'string')
        return [...previousExpression, currentExpression[index]?.[1] || ''];
      return previousExpression || '';
    }, [] as string[]);

  function joinLabels() {
    const upperLabels = reduceLabels(0);
    const lowerLabels = reduceLabels(1);

    return removeOverlap(upperLabels, lowerLabels);
  }

  const evaluateExpression = () =>
    !!numerator && !!denominator
      ? [
          (numerator / denominator).toFixed(2),
          labels?.[0].join(' • '),
          labels?.[1].length ? '/' : '',
          labels?.[1].join(' • '),
        ].join(' ')
      : 'Result';

  const onClickResults = () => {
    // Update data
    setNumerator(reduceFactors(0));
    setDenominator(reduceFactors(1));
    setLabels(joinLabels());
    // Clean up
    setExpression(cleanUpExpression(expression));
    // Set flags
    setWasInputChanged(false);
  };

  const result = useMemo(evaluateExpression, [evaluateExpression]);

  const updateExpression: CustomInputChangeHandler = (userInput, index, subunit) => {
    const areVariablesPositiveIntegers =
      index !== undefined && index >= 0 && subunit !== undefined && subunit >= 0;

    if (areVariablesPositiveIntegers) {
      if (stringifyIntoLabel(userInput) !== stringifyIntoLabel(expression[index][subunit]))
        setWasInputChanged(true);

      setExpression((prevInput) => {
        const newExpression = prevInput;
        const newValue: IInput = makeCompoundValue(userInput);

        newExpression[index][subunit] = newValue;
        return newExpression;
      });
    }

    setUpdate((prev) => prev + 1);
  };

  const insertExpression = (index: number) => {
    expression.splice(index, 0, [[1]]);
    setUpdate((prev) => prev + 1);
  };

  const deleteUnit = (index: number) => {
    setExpression(removeUnits(expression, index, () => setWasInputChanged(true)));

    setUpdate((prev) => prev + 1);
  };

  return (
    <div className="flex items-center justify-center h-full m-1 bg-gray-800 rounded-md shadow-md w-max">
      <Inserter
        onClick={(e) => {
          insertExpression(0);
          e.currentTarget.blur();
        }}
      />
      {expression.map((aUnit, unitIndex) => {
        const keyHash = aUnit.toString() + unitIndex;
        return (
          <div className="flex items-center justify-center h-full" key={keyHash}>
            <Unit
              input={aUnit}
              onChangeInput={updateExpression}
              index={unitIndex}
              onDeleteUnit={() => deleteUnit(unitIndex)}
            />
            <Inserter
              onClick={(e) => {
                insertExpression(unitIndex + 1);
                e.currentTarget.blur();
              }}
            />
          </div>
        );
      })}
      <button type="button" className="flex items-center p-2" onClick={onClickResults}>
        <FontAwesomeIcon icon={faEquals} size="2x" />
        <Output dimmed={result === 'Result' || wasInputChanged}>{result}</Output>
      </button>
    </div>
  );
}
