import React, { useMemo, useState } from 'react';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IExpression } from 'src/components/types';
import Unit, { Subunit } from 'src/components/Unit';
import { removeOverlap } from 'src/utils';

type Props = {
  input: IExpression;
};

export default function Expression({ input }: Props) {
  const [enumerator, setEnumerator] = useState(0);
  const [denominator, setDenominator] = useState(0);
  const [labels, setLabels] = useState<string[][]>();

  const reduceFactors = (index: 0 | 1) =>
    input.reduce((previousExpression, currentExpression) => {
      const factor = Number(currentExpression[index]?.[0]) || 1;
      return typeof currentExpression[index]?.[0] === 'number'
        ? previousExpression * factor
        : previousExpression;
    }, 1);

  const reduceLabels = (index: 0 | 1) =>
    input.reduce((previousExpression, currentExpression) => {
      if (typeof currentExpression[index]?.[1] === 'string')
        return [...previousExpression, currentExpression[index]?.[1] || ''];
      return previousExpression || '';
    }, [] as string[]);

  function joinLabels() {
    const upperLabels = reduceLabels(0);
    const lowerLabels = reduceLabels(1);

    return removeOverlap(upperLabels, lowerLabels);
  }

  const onClick = () => {
    setEnumerator(reduceFactors(0));
    setDenominator(reduceFactors(1));
    setLabels(joinLabels());
  };

  const result = useMemo(() => {
    return !!enumerator && !!denominator
      ? [
          (enumerator / denominator).toFixed(2),
          labels?.[0],
          labels?.[1].length ? '/' : '',
          labels?.[1],
        ].join(' ')
      : 'Result';
  }, [enumerator, denominator, labels]);

  return (
    <div className="flex items-center justify-center w-full p-3">
      {input.map((aUnit) => (
        <Unit key={aUnit.toString()} input={aUnit} />
      ))}
      <button type="button" className="p-2" onClick={onClick}>
        <FontAwesomeIcon icon={faEquals} size="2x" />
      </button>
      <Subunit input={result} />
    </div>
  );
}
