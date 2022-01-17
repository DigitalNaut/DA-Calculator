import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import Parenthesis from '../Parenthesis';

import Separator from './Separator';
import Subunit from './Subunit';

import { IUnit } from './types';
import { identityNeedle, stringifyIntoLabel } from './validation';

export default function Unit({ index, input, onChangeInput, onDeleteUnit }: IUnit) {
  const stringValue = useMemo(() => stringifyIntoLabel(input[1]), [input]);
  const identity = identityNeedle.test(stringValue);

  return (
    <div className="relative flex items-center group">
      {identity || <Parenthesis />}
      <div className="flex flex-col h-full bg-gray-700 rounded-2xl hover:bg-gray-600">
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
      <button
        type="button"
        className="absolute right-0 top-0 hidden group-hover:block z-50"
        onClick={onDeleteUnit}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>
  );
}
