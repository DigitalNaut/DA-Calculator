import React, { useMemo } from 'react';
import Parenthesis from '../Parenthesis';

import Separator from './Separator';
import Subunit from './Subunit';

import { IUnit } from './types';
import { identityNeedle, stringifyIntoLabel } from './validation';

export default function Unit({ index, input, onChangeInput }: IUnit) {
  const stringValue = useMemo(() => stringifyIntoLabel(input[1]), [input]);
  const identity = identityNeedle.test(stringValue);

  return (
    <div className="flex items-center m-0.5 group">
      {identity || <Parenthesis />}
      <div className="flex flex-col h-full p-0.5 -max bg-gray-800 rounded-2xl hover:bg-gray-700">
        <div className="flex h-full grow">
          <Subunit input={input[0]} onChangeInput={onChangeInput} index={index} subunit={0} />
        </div>
        <div className={identity ? 'hidden group-hover:block group-focus-within:block' : ''}>
          <Separator />
          <Subunit
            input={stringifyIntoLabel(input[1])}
            onChangeInput={onChangeInput}
            index={index}
            subunit={1}
          />
        </div>
      </div>
      {identity || <Parenthesis right />}
    </div>
  );
}
