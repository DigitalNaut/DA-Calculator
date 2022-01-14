import React from 'react';

import Expression from 'src/components/Expression';
import { IExpression } from 'src/components/types';

const expression1: IExpression = [
  [
    [2, 'grapes'],
    [1, 'm'],
  ],
  [
    [60, 'm'],
    [1, 'h'],
  ],
  [
    [24, 'h'],
    [1, 'd'],
  ],
  [[5, 'd'], [1]],
];
const expression2: IExpression = [
  [[15, 'wood']],
  [
    [4, 'planks'],
    [1, 'wood'],
  ],
  [
    [1, 'slabs'],
    [3, 'planks'],
  ],
];
const expression3: IExpression = [
  [
    [2, 'grapes'],
    [1, 'm'],
  ],
  [
    [60, 'm'],
    [1, 'h'],
  ],
  [
    [24, 'h'],
    [1, 'd'],
  ],
];

export default function Home(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <div className="flex flex-col items-center w-full">
        <Expression input={expression1} />
        <Expression input={expression2} />
        <Expression input={expression3} />
      </div>
    </div>
  );
}
