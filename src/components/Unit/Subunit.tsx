import React, { ChangeEventHandler, useState } from 'react';

import { ISubunit } from './types';
import {
  allLegalInputNeedle,
  allValidInputNeedle,
  stringifyIntoLabel as stringifyInput,
} from './validation';

export default function Subunit({
  index = -1,
  subunit,
  input,
  onChangeInput,
}: ISubunit): JSX.Element | null {
  const [userInput, setInput] = useState(stringifyInput(input) || '1');

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newUserInput = e.currentTarget.value;
    setInput((prevInput) => (allLegalInputNeedle.test(newUserInput) ? newUserInput : prevInput));
  };

  const submitInput = () => onChangeInput?.(userInput.trim(), index, subunit);

  return (
    <input
      placeholder="Factor label"
      className={[
        `w-full p-2 text-cente bg-gray-800 grow focus:bg-blue-50 border-2 border-transparent text-center rounded-2xl`,
        allValidInputNeedle.test(stringifyInput(userInput))
          ? ' focus:text-blue-900 focus:border-blue-900'
          : 'focus:text-red-700 focus:border-red-500',
      ].join(' ')}
      value={stringifyInput(userInput)}
      onChange={onChange}
      onBlur={submitInput}
    />
  );
}
