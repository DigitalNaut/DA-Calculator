import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import {
  factorNeedle,
  labelNeedle,
  labelSeparatorNeedle,
} from "src/validation/factor-labels";
import {
  separateFactorLabels,
  stringifyQuantity,
} from "src/validation/input-parser";

import type { SubunitProps } from "../types";

function useInput({
  index,
  inputQuantity,
  quantityPosition,
  isFocused,
  onChangeInput,
}: Omit<SubunitProps, "display" | "onFocused">) {
  const [inputString, setInputString] = useState(() =>
    stringifyQuantity(inputQuantity),
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
    onChangeInput(index, quantityPosition, adjustedInput);
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

  return {
    inputString,
    inputRef,
    changeHandler,
    blurHandler,
    keyDownHandler,
  };
}

function useInputHighlight(inputString: string) {
  const match = useMemo(() => separateFactorLabels(inputString), [inputString]);
  if (!match) return <>{inputString}</>;

  const [rawFactor, rawLabels] = match;

  const labels = rawLabels.match(labelSeparatorNeedle);

  return (
    <>
      {factorNeedle.test(rawFactor) ? (
        <div className="text-green-300">{rawFactor}</div>
      ) : null}

      {labels?.length ? <>&nbsp;</> : null}

      {labels?.map((rawLabel, index) => {
        const match = rawLabel.match(labelNeedle);
        const isInvalidLabel = match === null;

        const [, label, exponent] = match || [];

        return (
          <Fragment key={rawLabel}>
            <span
              key={rawLabel}
              className={
                isInvalidLabel
                  ? "text-red-500 group-hover/unit:rounded-md group-hover/unit:bg-red-400 group-hover/unit:text-red-800"
                  : "m-0 rounded-md px-0.5 group-hover/equation:bg-slate-700 group-hover/unit:bg-slate-600"
              }
            >
              {label || rawLabel}
              {exponent ? <sup>{exponent}</sup> : null}
            </span>
            {index < labels.length - 1 ? <>&nbsp;</> : null}
          </Fragment>
        );
      })}
    </>
  );
}

export default function Subunit({ onFocused, ...inputParams }: SubunitProps) {
  const { inputString, inputRef, changeHandler, blurHandler, keyDownHandler } =
    useInput(inputParams);

  const highlightedInput = useInputHighlight(inputString);

  return (
    <div className="group/subunit relative grow">
      <div className="pointer-events-none absolute flex size-full items-center justify-center group-focus-within/subunit:hidden">
        {highlightedInput}
      </div>
      <input
        ref={inputRef}
        placeholder="No value"
        className="w-full grow rounded-md border-2 border-transparent bg-transparent p-1 text-center text-transparent focus:bg-white focus:text-slate-900"
        value={inputString}
        onChange={changeHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        size={inputString.length || 1}
        maxLength={50}
        onFocus={onFocused}
      />
    </div>
  );
}
