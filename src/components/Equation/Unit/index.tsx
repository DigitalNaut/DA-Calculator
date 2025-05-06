import { faArrowsRotate, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { MouseEventHandler, PropsWithChildren } from "react";
import { useMemo, useRef } from "react";

import { quantityIsTrivial } from "src/logic/expressions";
import { cn } from "src/utils/styles";
import Parenthesis from "../Parenthesis";
import type { SubunitHandle, UnitProps } from "../types";
import Subunit from "./Subunit";

function Divider({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("my-0.5 h-px w-full bg-white", className)}>
      {children}
    </div>
  );
}

export default function Unit({
  index,
  inputRatio,
  onChangeInput,
  onDeleteUnit,
  isFocused,
  onFocused,
  onBlurred,
  onFlipUnit,
}: UnitProps) {
  const inputRefNumerator = useRef<SubunitHandle | null>(null);
  const inputRefDenominator = useRef<SubunitHandle | null>(null);

  const isTrivialDenominator = useMemo(
    () => quantityIsTrivial(inputRatio.denominator),
    [inputRatio.denominator],
  );

  const handleFlipUnit: MouseEventHandler<HTMLButtonElement> = () => {
    onFlipUnit();
  };

  return (
    <div
      className={cn("group/unit relative flex items-center", {
        "gap-0.5": !isTrivialDenominator,
      })}
    >
      {isTrivialDenominator ? null : <Parenthesis />}

      <div className="flex flex-col rounded-lg group-hover/unit:bg-slate-700">
        <div className="flex grow">
          <Subunit
            ref={inputRefNumerator}
            inputQuantity={inputRatio.numerator}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"numerator"}
            isFocused={isFocused}
            onFocused={onFocused}
            onBlurred={onBlurred}
          />
        </div>

        <div
          className={clsx({
            "hidden group-focus-within/unit:block group-hover/unit:block":
              isTrivialDenominator,
          })}
        >
          <Divider className="group relative">
            <button
              type="button"
              className="absolute left-1/2 z-100 -translate-1/2 cursor-pointer opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleFlipUnit}
            >
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className="rounded-full bg-white p-0.25 text-slate-800"
                size="xs"
              />
            </button>
          </Divider>
          <Subunit
            ref={inputRefDenominator}
            inputQuantity={inputRatio.denominator || { factor: 1 }}
            onChangeInput={onChangeInput}
            index={index}
            quantityPosition={"denominator"}
            onFocused={onFocused}
            onBlurred={onBlurred}
          />
        </div>
      </div>

      {isTrivialDenominator ? null : <Parenthesis right />}

      <button
        type="button"
        className="absolute top-0 right-0 z-50 hidden aspect-square translate-x-1/4 -translate-y-1/3 items-center justify-center rounded-full bg-white p-1 group-hover/unit:flex group-focus-within/unit:group-hover/unit:hidden"
        onClick={onDeleteUnit}
      >
        <FontAwesomeIcon className="text-slate-900" icon={faTimes} size="xs" />
      </button>
    </div>
  );
}
