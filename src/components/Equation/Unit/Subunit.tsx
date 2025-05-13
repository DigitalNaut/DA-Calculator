import type { FocusEventHandler, KeyboardEventHandler } from "react";
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

/**
 * Normalizes an input string to a valid quantity.
 * @param inputString
 * @returns The normalized string. If the string is invalid, returns "1".
 */
function normalizeInput(inputString: string) {
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

  const inputString = useMemo(
    () => stringifyQuantity(inputQuantity),
    [inputQuantity],
  );

  const focusHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    onFocused?.(event);
  };

  const [displayText, setDisplayText] = useState(() =>
    normalizeInput(inputString),
  );

  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    onBlurred?.(event);

    const adjustedInput = normalizeInput(event.currentTarget.value);

    if (adjustedInput === inputString) return;

    onChangeInput(index, quantityPosition, adjustedInput);
  };

  const changeHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    if (!event.currentTarget) return;
    event.currentTarget.size = event.currentTarget.value.length || 1;
    setDisplayText(normalizeInput(event.currentTarget.value));
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = ({
    currentTarget,
    key,
  }) => {
    if (key === "Enter") currentTarget.blur();
  };

  useEffect(
    /**
     * Updates the input element to reflect the current state of the expression when it changes.
     */
    function updateInput() {
      if (!inputRef.current) return;
      inputRef.current.value = inputString;
      setDisplayText(normalizeInput(inputString));
    },
    [inputRef, inputString],
  );

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
    displayText,
    blurHandler,
    changeHandler,
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
    displayText,
    focusHandler,
    changeHandler,
    blurHandler,
    keyDownHandler,
  } = useInput(inputParams);

  useImperativeHandle(
    inputParams.ref,
    () => ({
      focus: () => inputRef.current?.focus(),
    }),
    [inputRef],
  );

  return (
    <div className="group/subunit relative grow">
      <div className="pointer-events-none absolute flex size-full items-center justify-center group-focus-within/subunit:hidden">
        <StyledInput input={displayText} />
      </div>
      <input
        ref={inputRef}
        placeholder="No value"
        className="w-full grow rounded-md bg-transparent py-2 text-center text-transparent focus:bg-white focus:text-slate-900"
        defaultValue={inputString}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        onChange={changeHandler}
        size={inputString.length || 1}
        maxLength={50}
      />
    </div>
  );
}
