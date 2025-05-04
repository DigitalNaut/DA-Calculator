import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react";
import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

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

function adjustInput(inputString: string) {
  let adjustedInput = inputString.trim();
  adjustedInput = adjustedInput.replace(/\s+/g, " ");
  if (adjustedInput === "" || adjustedInput === "0") adjustedInput = "1";
  return adjustedInput;
}

function useInput({
  index,
  inputQuantity,
  quantityPosition,
  isFocused,
  onChangeInput,
  onFocused,
  onBlurred,
}: Omit<SubunitProps, "display">) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputString, setInputString] = useState(() =>
    stringifyQuantity(inputQuantity),
  );

  const changeHandler: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => setInputString(currentTarget.value);

  const focusHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    onFocused?.(event);
  };

  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    const adjustedInput = adjustInput(inputString);
    if (adjustedInput === inputString) return;

    setInputString(adjustedInput);
    onBlurred?.(event);
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
  }, [inputRef, isFocused]);

  return {
    inputString,
    inputRef,
    setInputString,
    changeHandler,
    blurHandler,
    focusHandler,
    keyDownHandler,
  };
}

function StyledInput({ input }: { input: string }) {
  const match = useMemo(() => separateFactorLabels(input), [input]);
  if (!match) return <>{input}</>;

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

export default function Subunit(inputParams: SubunitProps) {
  const {
    inputRef,
    inputString,
    setInputString,
    changeHandler,
    focusHandler,
    blurHandler,
    keyDownHandler,
  } = useInput(inputParams);

  useImperativeHandle(
    inputParams.ref,
    () => ({
      inputString,
      setInputString,
      focus: () => inputRef.current?.focus(),
    }),
    [inputRef, inputString, setInputString],
  );

  return (
    <div className="group/subunit relative grow">
      <div className="pointer-events-none absolute flex size-full items-center justify-center group-focus-within/subunit:hidden">
        <StyledInput input={inputString} />
      </div>
      <input
        ref={inputRef}
        placeholder="No value"
        className="w-full grow rounded-md bg-transparent py-2 text-center text-transparent focus:bg-white focus:text-slate-900"
        value={inputString}
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        size={inputString.length || 1}
        maxLength={50}
      />
    </div>
  );
}
