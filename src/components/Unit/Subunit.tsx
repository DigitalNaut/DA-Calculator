import React, { ChangeEventHandler, useState } from 'react';

import { ISubunit } from './types';
import { allLegalInputNeedle, allValidInputNeedle, stringifyValue } from './validation';

export default function Subunit({
  index = -1,
  subunit,
  input,
  onChangeInput,
}: ISubunit): JSX.Element | null {
  const [userInput, setInput] = useState(stringifyValue(input) || '1');

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newUserInput = e.currentTarget.value;
    setInput((prevInput) => (allLegalInputNeedle.test(newUserInput) ? newUserInput : prevInput));
  };

  const submitInput = () => onChangeInput?.(userInput.trim(), index, subunit);

  return (
    <input
      className={[
        `w-full p-2 text-cente bg-green-900 grow focus:bg-yellow-200`,
        allValidInputNeedle.test(stringifyValue(userInput))
          ? 'focus:text-blue-900'
          : 'focus:text-red-700',
      ].join(' ')}
      value={stringifyValue(userInput)}
      onChange={onChange}
      onBlur={submitInput}
    />
  );
}
