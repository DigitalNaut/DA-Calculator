import React from 'react';

import Expression from 'src/components/Expression';
import { IExpression } from 'src/components/types';

type ExpressionProps = {
  input: IExpression;
};

export function Expression({ input }: ExpressionProps) {
  return (
    <div className="flex items-center justify-center w-full p-3">
      {input.map((aUnit) => (
        <Unit key={aUnit.toString()} input={aUnit} />
      ))}
      <button type="button">
        <FontAwesomeIcon icon={faEquals} />
      </button>
      <div>Result</div>
    </div>
  );
}

const expression: IExpression = [
  [
    [2, 'grapes'],
    [1, 'h'],
  ],
  [
    [24, 'h'],
    [1, 'd'],
  ],
  [[5, 'd']],
];

export default function Home(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <div className="flex flex-col items-center w-full">
        <Expression input={expression} />
      </div>
    </div>
  );
}
