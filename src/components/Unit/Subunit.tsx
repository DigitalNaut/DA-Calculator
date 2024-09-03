import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { twMerge } from "tailwind-merge";

import { type Subunit as SubunitType } from "./types";
import {
  allLegalInputNeedle,
  allValidInputNeedle,
  stringifyIntoLabel as stringifyInput,
} from "./validation";

export default function Subunit({
  index = -1,
  subunit,
  input,
  onChangeInput,
}: SubunitType): JSX.Element | null {
  const [userInput, setInput] = useState(stringifyInput(input) || "1");

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newUserInput = e.currentTarget.value;
    setInput((prevInput) =>
      allLegalInputNeedle.test(newUserInput) ? newUserInput : prevInput
    );
  };

  const submitInput = () => onChangeInput?.(userInput.trim(), index, subunit);

  const blur: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const isAllInputValid = allValidInputNeedle.test(stringifyInput(userInput));

  return (
    <input
      placeholder="No value"
      className={twMerge(
        "w-full p-2 text-center grow focus:bg-white border-2 border-transparent bg-transparent rounded-md z-10",
        isAllInputValid
          ? " focus:text-blue-900 focus:border-blue-900"
          : "focus:text-red-700 focus:border-red-500"
      )}
      value={stringifyInput(userInput)}
      onChange={onChange}
      onBlur={submitInput}
      onKeyDown={blur}
      size={userInput.length || 5}
    />
  );
}
