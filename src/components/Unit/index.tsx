import React, { useMemo } from 'react';

import Separator from './Separator';
import Subunit from './Subunit';

import { IUnit } from './types';
import { stringifyValue } from './validation';

export default function Unit({ index, input, onChangeInput }: IUnit) {
  const stringValue = useMemo(() => stringifyValue(input[1]), [input]);
  const identity = stringValue === '' || stringValue === '1';

  return (
    <div className="group flex flex-col p-0.5 bg-yellow-300 w-max h-full">
      <div className="flex h-full bg-red-400 p-0.5 grow">
        <Subunit input={input[0]} onChangeInput={onChangeInput} index={index} subunit={0} />
      </div>
      <div
        className={[
          'p-1',
          identity ? 'hidden group-hover:block group-focus-within:block' : 'bg-blue-400',
        ].join(' ')}
      >
        <Separator />
        <Subunit
          input={stringifyValue(input[1])}
          onChangeInput={onChangeInput}
          index={index}
          subunit={1}
        />
      </div>
    </div>
  );
}
