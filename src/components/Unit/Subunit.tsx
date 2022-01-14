import React, { ChangeEventHandler, useMemo, useState } from 'react';

import { ICompoundInput, ISubunit } from './types';

export function makeCompoundValue(haystack: string): ICompoundInput {
  const needle = /^(\d+)\s?(.+)$/;
  const results = needle.exec(haystack);

  return [Number(results?.[1] || 1), results?.[2]];
}

export function stringifyValue(userInput: string | ICompoundInput) {
  if (typeof userInput === 'string') return userInput;
  return userInput.join(' ');
}

export default function Subunit({ index = -1, subunit, input, onChangeInput }: ISubunit) {
  const [userInput, setInput] = useState(input);

  const stringifiedValue = useMemo(() => stringifyValue(userInput), [userInput]);

  if (!userInput[1]?.length && userInput[0] === 1) return <></>;

  if (typeof userInput === 'string')
    return (
      <input
        disabled
        className="p-2 text-center text-green-900 bg-green-100 w-min"
        value={userInput}
      />
    );

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setInput(makeCompoundValue(e.currentTarget.value));

  const submitInput = () => onChangeInput(stringifyValue(userInput), index, subunit);

  return (
    <input
      className="w-full p-2 text-center bg-green-700"
      value={stringifiedValue}
      onChange={onChange}
      onBlur={submitInput}
    />
  );
}
