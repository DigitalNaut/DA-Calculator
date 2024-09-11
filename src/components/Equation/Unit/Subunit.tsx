import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

import { stringifyQuantity } from "src/validation/input-parser";

import { SubunitProps } from "../types";

export default function Subunit({
  index = -1,
  quantityPosition: subunit,
  inputQuantity: input,
  onChangeInput,
  isFocused,
  onFocused,
}: SubunitProps) {
  const [inputString, setInputString] = useState(() =>
    stringifyQuantity(input),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const changeHandler: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => setInputString(currentTarget.value);

  const blurHandler: FocusEventHandler<HTMLInputElement> = () => {
    let adjustedInput = inputString.trim();
    adjustedInput = adjustedInput.replace(/\s+/g, " ");
    if (adjustedInput === "" || adjustedInput === "0") adjustedInput = "1";

    setInputString(adjustedInput);
    onChangeInput(index, subunit, adjustedInput);
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = ({
    currentTarget,
    key,
  }) => {
    if (key === "Enter") currentTarget.blur();
  };

  useEffect(() => {
    if (!inputRef.current) return;

    if (isFocused) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isFocused]);

  const isAllInputValid = true;

  return (
    <input
      ref={inputRef}
      placeholder="No value"
      className={twMerge(
        "z-10 w-full grow rounded-md border-2 border-transparent bg-transparent p-2 text-center focus:bg-white",
        isAllInputValid
          ? "focus:border-blue-900 focus:text-blue-900"
          : "focus:border-red-500 focus:text-red-700",
      )}
      value={inputString}
      onChange={changeHandler}
      onBlur={blurHandler}
      onKeyDown={keyDownHandler}
      size={inputString.length || 5}
      onFocus={onFocused}
    />
  );
}
